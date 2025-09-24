import { VerifyPaymentResp } from "../dtos/pickupReq/paymentDTO";
import {
  PaymentDTO,
  PickupReqDTO,
  PickupPaymentSummaryDTO,
  PickupPlansDTO,
  PopulatedPIckupPlans,
  PickupReqGetDTO,
  IPickupRequestExtDocument,
} from "../dtos/pickupReq/pickupReqDTO";
import { IPayment } from "../models/pickupRequests/interfaces/paymentInterface";
import { IPickupRequestDocument } from "../models/pickupRequests/interfaces/pickupInterface";

export class PickupRequestMapper {
  static mapPickupReqDTO(doc: IPickupRequestDocument): PickupReqDTO {
    return {
      _id: doc._id.toString(),
      userId: doc.userId.toString(),
      driverId: doc.driverId?.toString(),
      wasteplantId: doc.wasteplantId?.toString(),
      truckId: doc.truckId?.toString(),
      addressId: doc.addressId.toString(),
      wasteType: doc.wasteType,
      originalPickupDate: doc.originalPickupDate,
      rescheduledPickupDate: doc.rescheduledPickupDate,
      pickupTime: doc.pickupTime,
      pickupId: doc.pickupId,
      businessName: doc.businessName ?? "",
      service: doc.service ?? "",
      frequency: doc.frequency ?? "",
      parentRequestId: doc.parentRequestId?.toString(),
      status: doc.status ?? null,
      trackingStatus: doc.trackingStatus ?? null,
      eta: {
        text: doc.eta?.text ?? null,
        value: doc.eta?.value ?? null,
      },
      payment: this.mapPayment(doc.payment),
    };
  }
  static mapGetPickupReqDTO(doc: IPickupRequestExtDocument): PickupReqGetDTO {
    const primaryAddress = doc.userId?.addresses?.find(
      (addr) => addr._id.toString() === doc.addressId.toString(),
    );

    return {
      _id: doc._id.toString(),
      userId: {
        _id: doc.userId?._id?.toString() ?? "",
        firstName: doc.userId?.firstName ?? "",
        lastName: doc.userId?.lastName ?? "",
      },
      userName: `${doc.userId.firstName} ${doc.userId.lastName}`,
      userAddress: primaryAddress
        ? {
            _id: primaryAddress._id.toString(),
            addressLine1: primaryAddress.addressLine1,
            addressLine2: primaryAddress.addressLine2,
            taluk: primaryAddress.taluk,
            location: primaryAddress.location,
            state: primaryAddress.state,
            pincode: primaryAddress.pincode,
            district: primaryAddress.district,
            latitude: primaryAddress.latitude ?? 0,
            longitude: primaryAddress.longitude ?? 0,
          }
        : undefined,
      location: primaryAddress?.location ?? "",
      driverId: doc.driverId?._id?.toString(),
      wasteplantId: doc.wasteplantId?.toString(),
      truckId: doc.truckId?._id?.toString(),
      addressId: doc.addressId?.toString(),
      wasteType: doc.wasteType,
      originalPickupDate: doc.originalPickupDate,
      rescheduledPickupDate: doc.rescheduledPickupDate,
      pickupTime: doc.pickupTime,
      pickupId: doc.pickupId,
      status: doc.status,
      trackingStatus: doc.trackingStatus,
      eta: doc.eta,
      payment: doc.payment,
    };
  }

  static mapPayment(payment: IPayment): PaymentDTO {
    return {
      status: payment?.status ?? "Pending",
      method: payment?.method ?? "",
      razorpayOrderId: payment?.razorpayOrderId ?? null,
      razorpayPaymentId: payment?.razorpayPaymentId ?? null,
      razorpaySignature: payment?.razorpaySignature ?? null,
      amount: payment?.amount ?? 0,
      paidAt: payment?.paidAt ?? null,
      refundRequested: payment?.refundRequested ?? false,
      refundStatus: payment?.refundStatus ?? null,
      refundAt: payment?.refundAt ?? null,
      razorpayRefundId: payment?.razorpayRefundId ?? null,
      inProgressExpiresAt: payment?.inProgressExpiresAt ?? null,
    };
  }
  static toSummaryDTO(
    doc: Partial<IPickupRequestDocument>,
  ): PickupPaymentSummaryDTO {
    return {
      _id: doc._id?.toString() ?? "",
      pickupId: doc.pickupId ?? "",
      originalPickupDate: doc.originalPickupDate ?? new Date(),
      rescheduledPickupDate: doc.rescheduledPickupDate,
      wasteType: doc.wasteType ?? "Residential",
      status: doc.status ?? "",
      payment: {
        status: doc.payment?.status ?? "Pending",
        amount: doc.payment?.amount ?? 0,
        method: doc.payment?.method ?? "",
        paidAt: doc.payment?.paidAt ?? null,
        refundStatus: doc.payment?.refundStatus ?? null,
        razorpayOrderId: doc.payment?.razorpayOrderId ?? null,
        refundRequested: doc.payment?.refundRequested ?? false,
        refundAt: doc.payment?.refundAt ?? null,
      },
    };
  }
  static toPaymentDTO(doc: IPickupRequestDocument): VerifyPaymentResp {
    return {
      pickupReqId: doc._id.toString(),
      payment: this.mapPayment(doc.payment),
    };
  }
  static toPickupPlansDTO(doc: PopulatedPIckupPlans): PickupPlansDTO {
    return {
      _id: doc._id.toString(),
      pickupId: doc.pickupId,
      wasteType: doc.wasteType,
      originalPickupDate: doc.originalPickupDate.toISOString() ?? "",
      rescheduledPickupDate: doc.rescheduledPickupDate?.toISOString() ?? "",
      pickupTime: doc.pickupTime,
      status: doc.status,
      trackingStatus: doc.trackingStatus ?? null,
      eta: doc.eta ?? { text: null, value: null },
      userId: doc.userId.toString() ?? "",
      user: doc.user
        ? {
            firstName: doc.user.firstName,
            lastName: doc.user.lastName,
            phone: doc.user.phone ?? "",
          }
        : { firstName: "", lastName: "", phone: "" },
      driverId: doc.driverId
        ? {
            _id: doc.driverId._id.toString(),
            name: doc.driverId.name,
            contact: doc.driverId.contact,
          }
        : undefined,
      truckId: doc.truckId
        ? {
            _id: doc.truckId._id.toString(),
            name: doc.truckId.name,
            vehicleNumber: doc.truckId.vehicleNumber,
          }
        : undefined,
      address: doc.address
        ? {
            _id: doc.address._id.toString(),
            addressLine1: doc.address.addressLine1 ?? "",
            addressLine2: doc.address.addressLine2 ?? "",
            location: doc.address.location ?? "",
            taluk: doc.address.taluk ?? "",
            district: doc.address.district ?? "",
            pincode: doc.address.pincode ?? "",
            state: doc.address.state ?? "",
            latitude: doc.address.latitude ?? 0,
            longitude: doc.address.longitude ?? 0,
          }
        : null,

      // address: {
      //   _id: doc.address._id.toString(),
      //   addressLine1: doc.address.addressLine1 ?? "",
      //   addressLine2: doc.address.addressLine2 ?? "",
      //   location: doc.address.location ?? "",
      //   taluk: doc.address.taluk ?? "",
      //   district: doc.address.district ?? "",
      //   pincode: doc.address.pincode ?? "",
      //   state: doc.address.state ?? "",
      //   latitude: doc.address.latitude ?? 0,
      //   longitude: doc.address.longitude ?? 0,
      // },
      addressId: doc.addressId.toString() ?? "",
      payment: doc.payment,
      wasteplantId: doc.wasteplantId?.toString() ?? "",
      // createdAt: doc.createdAt.toISOString(),
      // updatedAt: doc.updatedAt.toISOString(),
    };
  }
  static mapToPickupPlansDTO(docs: PopulatedPIckupPlans[]): PickupPlansDTO[] {
    return docs.map((doc) => this.toPickupPlansDTO(doc));
  }
  static mapPickupReqsDTO(docs: IPickupRequestDocument[]): PickupReqDTO[] {
    return docs.map((doc) => this.mapPickupReqDTO(doc));
  }

  static mapPickupReqsGetDTO(
    docs: (IPickupRequestDocument | IPickupRequestExtDocument)[],
  ): PickupReqGetDTO[] {
    return docs.map((doc) =>
      this.mapGetPickupReqDTO(doc as IPickupRequestExtDocument),
    );
  }
}
