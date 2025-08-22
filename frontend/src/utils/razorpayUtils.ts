export const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (document.querySelector("#razorpay-script")) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject("Razorpay SDK failed to load.");
    document.body.appendChild(script);
  });
};