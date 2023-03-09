fs = require("fs");

try {
  const data = fs.readFileSync("crypto_tax.txt", "utf8");

  const splitedData = data.toString().split("\n");

  const mappedData = splitedData.map((d) => {
    let item = d.trim().split(/\s+/);
    item[2] = Number(item[2]);
    item[3] = Number(item[3]);
    return item;
  });

  let buyArr = { BTC: [], ETH: [] };
  let profit = 0;

  for (const item of mappedData) {
    const coinType = item[1];
    if (item[0] === "S") {
      buyArr[coinType] = buyArr[coinType].filter(f => f[3] > 0);
      let sellItem = item;
      const amount = buyArr[coinType].reduce((r, d) => (r += d[3]), 0);
      let sellAmount = sellItem[3];
      let sellPrice = sellItem[2];
      if (sellAmount > amount) {
        throw "the coins is not enough";
      } else {
        for (let i = 0; i < buyArr[coinType].length; i++) {
          const buy = buyArr[coinType][i];
          if (buy[3] !== 0) {
            if (sellAmount !== 0) {
              let _amount = null;
              if (sellAmount > buy[3]) {
                _amount = buy[3];
                sellAmount = sellAmount - buy[3];
                buy[3] = 0;
              } else {
                _amount = sellAmount;
                buy[3] = buy[3] - sellAmount;
                sellAmount = 0;
              }
              let _profit = (sellPrice - buy[2]) * _amount;
              profit += _profit;
              buyArr[coinType][i] = buy;
            }
          }
        }
      }
    } else {
      buyArr[coinType].push(item);
    }
  }

  console.log("profit is", profit);
} catch (e) {
  console.log("Error:", e);
}
