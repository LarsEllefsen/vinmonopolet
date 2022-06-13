class RawMaterial {
  id: string;
  name: string;
  percentage: number | null;

  constructor({ id, name, percentage }) {
    this.id = id;
    this.name = name;
    this.percentage = percentage ? Number(percentage) : null;
  }
}

RawMaterial.prototype.toString = function () {
  return this.name;
};

export default RawMaterial;
