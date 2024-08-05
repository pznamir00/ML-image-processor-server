import { checkImageExistsByName } from "../gateways/image.gateway";
import { validateImageName } from "./images.validator";

describe("images validator", () => {
  describe("validateImageName", () => {
    it("passes if image name is valid", () => {
      expect(async () => {
        await validateImageName("img1.jpg");
      }).not.toThrow();
    });

    it("does not pass if image name is invalid", async () => {
      try {
        //@ts-ignore
        checkImageExistsByName.mockReturnValueOnce(false);
        await validateImageName("img1.jpg");
        throw new Error("Error should have been thrown");
      } catch (error: any) {
        expect(error.message).toEqual("Image with name img1.jpg doesn't exist");
      }
    });
  });
});

jest.mock("../gateways/image.gateway", () => ({
  checkImageExistsByName: jest.fn(() => true),
}));
