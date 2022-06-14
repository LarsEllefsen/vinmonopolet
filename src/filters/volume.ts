import numberFilter from "./number";

const units = {
  ml: 1000,
  cl: 100,
  dl: 10,
  l: 1, // eslint-disable-line id-length
  liter: 1,
};

export default function volumeFilter(val) {
  if (!val) {
    return null;
  } else if (typeof val === "number") {
    return val;
  }

  const unit = val.match(/(ml|cl|dl|l|liter)/) || [];
  const amount = numberFilter.greedy(val);
  const factor = units[unit[1]] || 1;

  return amount ? amount / factor : null;
}
