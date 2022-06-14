import ProductStatus from "../models/ProductStatus";
const map = {
  aktiv: ProductStatus.ACTIVE,
  utsolgt: ProductStatus.OUT_OF_STOCK,
  utgatt: ProductStatus.EXPIRED,
};

export default function statusFilter(val: string): string {
  return map[val];
}
