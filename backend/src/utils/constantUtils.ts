export const PASSWORD_RULES = {
  MIN_LENGTH: 6,
};
export const MESSAGES = {
  COMMON: {
    SUCCESS: {
      REGISTERED:
        "Registered successfully. OTP sent to email for verification.",
      PAYMENT_SUCCESSFUL: "Payment successful.",
      OTP_VERIFIED: "OTP verified successfully.",
      OTP_SENT: "A new OTP has been sent to your email.",
      LOGIN: "Login successfull",
      PASSWORD_RESET: "Your password reset successfully, you can Login.",
      LOGOUT: "Logged out Successfully",
      PROFILE_UPDATED: "Your profile is updated successfully",
      PASSWORD_CHANGED: "Password changed successfully",
      REFUND_UPDTAE_SUCCESS : "Update refund status successfully.",
      REFUND_SUCCESS: "Refund process success.",
      RETRY_ORDER_PAY_SUCCESS: "Retry payment order suceess.",
      SIGNUP: "Signup successfully.",
      SIGNIN: "Signin successfully.",
      SEND_NOTIFICATION: "Send notification successfully.",
      BLOCK_UPDATE: "Block status updated successfully.",
      PICKUP_APPROVE: "Pickup approved successfully.",
      PICKUP_CANCEL:"Pickup request canceled successfully.",
      PICKUP_RESCHEDULE:"Pickup rescheduled successfully.",
    },
    ERROR: {
      FETCH_PAYMENT_FAIL: "Fetch payments failed.",
      CREATE_PAYMENT_FAIL: "Create payment failed.",
      VERIFY_PAYMENT_FAIL: "Verification payment failed.",
      FETCH_PICKUP_FAIL: "Fetch pickup plans failed.",
      UPDATE_PICKUP_FAIL: "Update pickup plans failed.",
      DELETE_PICKUP_FAIL: "Delete pickup plans failed.",
      // INVALID_NAME: "Invalid name.",
      // INVALID_EMAIL: "Invalid email address.",
      // INVALID_PHONE: "Invalid phone number.",
      // WEAK_PASSWORD: `Password must be at least ${PASSWORD_RULES.MIN_LENGTH} characters long.`,
      // PASSWORD_MISMATCH: "Password and Confirm Password must match.",
      INVALID_CREDENTIALS: "Invalid credentials.",
      // EMAIL_IN_USE: "Email is already in use.",
      EMAIL_UID_REQUIRED: "Email and UID are required",
      EMAIL_PASSWORD_REQUIRED: "Email and password are required",
      EMAIL_OTP_REQUIRED: "Email and OTP are required",
      ID_REQUIRED: "Id is required.",
      MISSING_FIELDS: "All fields are required.",
      UNAUTHORIZED: "Unauthorized access.",
      UNAUTHENTICATED: "You are not authenticated.",
      UNKNOWN_ERROR: "An unknown error occurred. Please try again later.",
      ACCOUNT_NOT_VERIFIED: "Account not verified. Please verify your email.",
      EMAIL_NOT_FOUND: "Email not found.",
      INVALID_EXPIRED_OTP: "Invalid or expired OTP",
      OTP_EXPIRED: "OTP has expired. Request a new OTP.",
      INVALID_OTP: "Invalid OTP. Please check and try again.",
      FAILED_OTP: "Failed to send OTP",
      ALREADY_VERIFIED: "Account is already verified.",
      NO_OTP_FOUND: "No OTP found. Please request a new one.",
      BLOCKED: "Your account is blocked.",
      INVALID_BLOCK: "Invalid block status.",
      JWT_SECRET_MISSING: "JWT token is not configured",
      NO_TOKEN: "Token not found",
      POST_OFFICE_ERROR: "No post offices found for this PIN code.",
      PINCODE_ALLOW_ERROR: "Only pincodes from Malappuram district are allowed.",
      INVALID_ROLE: "Invalid user role.",
      OTP_SENT: "Failed to send OTP.",
      RESENT_OTP: "Failed to resend OTP.",
      REFRESH_TOKEN: "No refresh token provided.",
      SIGNUP: "Signup failed.",
      INVALID_REFUND_STATUS: "Invalid refund status.",
      LOCATION_REQUIRED: "Location is required."
    },
  },
  WASTEPLANT: {
    SUCCESS: {
      FETCH: "Fetch waste plants successfully.",
      CREATED: "Waste plant created successfully.",
      UPDATED: "Waste plant updated successfully.",
      DELETED: "Waste plant deleted successfully.",
      PAYMENT: "Payment success.",
      SUBSCRIPTION_PLAN: "Fetch subscription plan successfully.",
      SUBSCRIPTION_CANCEL: "Send subscription cancel request.",
      DROP_SPOT_CREATE: "Dropspot created successfully.",
      DROP_SPOT_UPDATE: "Dropspot updated successfully.",
      DROP_SPOT_DELETE: "Dropspot deleted successfully.",
      FETCH_DROP_SPOT: "Fetch dropspots successfully.",
      WASTE_MWASURED: "Waste measurement saved.",
      CRETAE_TRUCK: "Truck created successfully.",
      FETCH_TRUCK: "Fetch trucks successfully",
      TRUCK_UPDATE: "Truck updated successfully.",
      TRUCK_DELETE: "Truck deleted successfully.",
      FETCH_TRUCK_REQ: "Fetch avaialable truck requests successfully.",
      ASSIGN_TRUCK_DRIVER: "Assign truck to driver successfully."
    },
    ERROR: {
      ID_REQUIRED: "Plant ID is required.",
      DOCUMENT_REQUIRED: "License document is required.",
      PDF_FILES_REQUIRED: "Only PDF files are allowed.",
      NOT_FOUND: "Waste Plant not found.",
      FAILED: "Wasteplant updation failed.",
      PAYMENT: "Payment failed.",
      DROP_SPOT_CREATE: "Dropspot failed to create.",
    },
  },
  DRIVER: {
    SUCCESS: {
      FETCH_DRIVER: "Fetch drivers successfully.",
      CREATE_DRIVER: "Driver created successfully.",
      UPDATE_DRIVER: "Driver updated successfully.",
      DELETE_DRIVER: "Driver deleted successfully."

    },
    ERROR: {
      IMG_ERRROR: "Both license front and back images are required."
    },
  },
  USER: {
    SUCCESS: {
      RESIDENTIAL_PICKUP: "Fetch residential page successfully.",
      COMMERCIAL_PICKUP: "Fetch commercial page successfully.",
      PICKUP_CANCEL: "Pickup canceled successfully.",
      PICKUP_UPDATED: "Pickup updated successfully.",
      PICKUP_CREATED: "Pickup created successfully.",
      FETCH_DROPSPOTS: "Fetch dropspots successfully.",
      PROFILE_UPDATE: "Profile updated successfully."
    },
    ERROR: {
      NOT_FOUND: "User not found.",
      WASTEPLANT_BLOCK: "Services unavailable: Waste plant is blocked",
      PICKUP_CANCEL: "Failed to cancel pickup.",
      PICKUP_UPDATED: "Failed to update pickup.",
      PICKUP_DATE: "Invalid pickup date format.",
      PICKUP_CREATED: "Failed to create pickup.",
      FETCH_PROFILE: "Failed to fetch Profile.",
      FETCH_EDIT_PROFILE: "Failed to fetch edit profile.",
      PROFILE_UPDATE: "Failed to update profile."
    },
  },

  SUPERADMIN: {
    SUCCESS: {
      DOCUMENT_VERIFIED: "Document has been verified successfully",
      DOCUMENT_REJECTED: "Document has been rejected",
      SUBSCRIPTION_CREATED: "Subscription created successfully",
      SUBSCRIPTION_UPDATED: "Subscription updated successfully",
      SUBSCRIPTION_DELETED: "Subscription deleted successfully",
      PAYMENT_HISTORY: "Fetch payment history successfully",
      SUBSCRIPTION_PLANS: "Fetch subscription plans successfully.",
      ADD_WASTEPLANT: "Fetch add wasteplant succesfully."
    },
    ERROR: {
      FAILED_DOC_VERIFY: "Document verification failed",
      INVALID_SUBSCRIPTION_NAME: "Subscription plan name is required",
      INVALID_SUBSCRIPTION_DURATION:
        "Valid subscription duration is required (Monthly, 6 Months, Yearly).",
      INVALID_SUBSCRIPTION_PRICE:
        "A valid subscription price greater than 0 is required.",
    },
  },
};

export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  FORBIDDEN: 403,
};
