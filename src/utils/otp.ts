import randomString from "randomstring";

export const generateOTP = async () => {
  const otp = randomString.generate({
    length: 4,
    charset: "numeric",
  });

  return otp;
};
