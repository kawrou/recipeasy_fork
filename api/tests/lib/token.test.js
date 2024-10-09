const {
  generateToken,
  generateRefreshToken,
  decodeToken,
} = require("../../src/lib/token");

describe("TokenGenerator", () => {
  describe("generateToken:", () => {
    test("returns an 'access' token containing user_id that is valid for 10 minutes", () => {
      const id_1 = 1;
      const id_2 = 2;

      // Encode tokens
      const token_1 = generateToken(id_1);
      const token_2 = generateToken(id_2);
      expect(token_1).not.toEqual(token_2);

      // Decode tokens
      const payload_1 = decodeToken(token_1);
      const payload_2 = decodeToken(token_2);

      expect(payload_1.user_id).toEqual(id_1);
      expect(payload_2.user_id).toEqual(id_2);

      // Token is valid for 600 seconds (10 minutes)
      expect(payload_1.exp - payload_1.iat).toEqual(600);
    });
  });

  describe("generateRefreshTokeh:", () => {
    test("returns a 'refresh' token containing user_id that is valid for 1 day", () => {
      const id_1 = 1;
      const id_2 = 2;

      const token_1 = generateRefreshToken(id_1);
      const token_2 = generateRefreshToken(id_2);
      expect(token_1).not.toEqual(token_2);

      const payload_1 = decodeToken(token_1);
      const payload_2 = decodeToken(token_2);

      expect(payload_1.user_id).toEqual(id_1);
      expect(payload_2.user_id).toEqual(id_2);

      // Token is valid for 1 day
      expect(payload_1.exp - payload_1.iat).toEqual(86400);
    });
  });
});
