(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function init() {
    $("isVehicle").addEventListener("change", function () {
      $("vehicleFields").classList.toggle("show", $("isVehicle").checked);
    });
    $("saleDate").value = new Date().toISOString().slice(0, 10);
    $("gen").addEventListener("click", generate);
  }

  function generate() {
    var status = $("status");
    var sellerName = $("sellerName").value.trim();
    var buyerName = $("buyerName").value.trim();
    var itemDesc = $("itemDesc").value.trim();
    var price = $("price").value;

    if (!sellerName || !buyerName || !itemDesc || !price) {
      status.textContent = "Fill in seller name, buyer name, item description, and price first.";
      return;
    }

    var isVehicle = $("isVehicle").checked;
    var w = window.open("", "_blank");
    if (!w) {
      status.textContent = "Your browser blocked the document window. Allow pop-ups for this page and try again.";
      return;
    }
    var out = w.document;
    out.title = "Bill of Sale";
    var style = out.createElement("style");
    style.textContent =
      "body{font:13px/1.6 Georgia,serif;margin:40px;color:#111;max-width:720px}" +
      "h1{font-size:20px;text-align:center;margin:0 0 20px}" +
      "table{width:100%;border-collapse:collapse;margin:12px 0}" +
      "td,th{border:1px solid #999;padding:6px 8px;text-align:left;vertical-align:top;font-size:12px}" +
      "p{margin:10px 0}" +
      ".sig{margin-top:50px;display:flex;justify-content:space-between}" +
      ".sigline{width:45%}" +
      ".sigline .line{border-top:1px solid #111;margin-top:36px;padding-top:4px;font-size:11px;color:#333}" +
      ".small{font-size:10px;color:#444;margin-top:30px}" +
      "@media print{button{display:none}}";
    out.head.appendChild(style);

    var body = out.body;
    var h1 = out.createElement("h1");
    h1.textContent = "Bill of Sale";
    body.appendChild(h1);

    var saleDate = $("saleDate").value || "—";
    var price_num = parseFloat(price) || 0;
    var payMethod = $("payMethod").value.trim() || "—";
    var asIs = $("asIs").checked;

    var intro = out.createElement("p");
    intro.innerHTML = "This Bill of Sale documents the sale of the item described below, on " + esc(saleDate) +
      ", by the Seller to the Buyer named here, for the sum of <strong>$" + price_num.toFixed(2) + "</strong>, paid via " + esc(payMethod) + ".";
    body.appendChild(intro);

    var t = out.createElement("table");
    var rows = [
      ["Seller", esc(sellerName) + (($("sellerAddr").value.trim()) ? "<br>" + esc($("sellerAddr").value.trim()) : "")],
      ["Buyer", esc(buyerName) + (($("buyerAddr").value.trim()) ? "<br>" + esc($("buyerAddr").value.trim()) : "")],
      ["Item description", esc(itemDesc).replace(/\n/g, "<br>")],
    ];
    if (isVehicle) {
      var vy = $("vYear").value.trim(), vm = $("vMake").value.trim(), vmo = $("vModel").value.trim(),
          vvin = $("vVin").value.trim(), vodo = $("vOdo").value.trim();
      rows.push(["Vehicle", [vy, vm, vmo].filter(Boolean).join(" ") || "—"]);
      if (vvin) rows.push(["VIN", esc(vvin)]);
      if (vodo) rows.push(["Odometer reading", esc(vodo)]);
    }
    rows.push(["Sale price", "$" + price_num.toFixed(2)]);
    rows.push(["Payment method", esc(payMethod)]);
    rows.push(["Date of sale", esc(saleDate)]);
    rows.push(["Condition", asIs ? "Sold as-is, with no warranty expressed or implied" : "See description above"]);

    rows.forEach(function (r) {
      var tr = out.createElement("tr");
      var th = out.createElement("th");
      th.style.width = "160px";
      th.textContent = r[0];
      var td = out.createElement("td");
      td.innerHTML = r[1];
      tr.appendChild(th);
      tr.appendChild(td);
      t.appendChild(tr);
    });
    body.appendChild(t);

    if (isVehicle) {
      var vnote = out.createElement("p");
      vnote.className = "small";
      vnote.textContent = "This document records a private transaction. Transferring the vehicle's title is a separate step handled through your state's motor vehicle agency.";
      body.appendChild(vnote);
    }

    var sig = out.createElement("div");
    sig.className = "sig";
    sig.innerHTML =
      "<div class='sigline'><div class='line'>Seller signature — " + esc(sellerName) + "</div></div>" +
      "<div class='sigline'><div class='line'>Buyer signature — " + esc(buyerName) + "</div></div>";
    body.appendChild(sig);

    var small = out.createElement("p");
    small.className = "small";
    small.textContent = "General template only, not legal advice. Notarization and title-transfer requirements vary by state.";
    body.appendChild(small);

    var btn = out.createElement("button");
    btn.textContent = "Print / Save as PDF";
    btn.style.cssText = "margin-top:24px;padding:10px 18px;font:14px system-ui;cursor:pointer";
    btn.addEventListener("click", function () { w.print(); });
    body.insertBefore(btn, body.firstChild);

    status.textContent = "Document ready in the new tab — use “Print / Save as PDF.”";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
