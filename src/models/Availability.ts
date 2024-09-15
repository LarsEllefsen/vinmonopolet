export interface IAvailability {
  deliveryAvailability: {
    availableForPurchase: boolean;
    infos: { availability: string; readableValue: string }[];
  };
  storesAvailability: {
    availableForPurchase: boolean;
    infos: { availability: string; readableValue: string }[];
  };
}
