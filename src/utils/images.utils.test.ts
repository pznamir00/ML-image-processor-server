import { setDefaultImageProps } from "./images.utils";

describe("images utils", () => {
  describe("setDefaultImageProps", () => {
    it("sets name", () => {
      const obj: any = {};
      setDefaultImageProps(obj);
      expect(obj.name).toEqual("123-abc.jpg");
    });

    it("sets url", () => {
      const obj: any = {};
      setDefaultImageProps(obj);
      expect(obj.url).toEqual(expect.stringMatching("/images/123-abc.jpg$"));
    });

    it("sets isUploaded", () => {
      const obj: any = {};
      setDefaultImageProps(obj);
      expect(obj.isUploaded).toBe(false);
    });

    it("sets metadata", () => {
      const obj: any = {};
      setDefaultImageProps(obj);
      expect(obj.metadata).toBeNull();
    });
  });
});

jest.mock("uuid", () => ({ v4: jest.fn().mockReturnValue("123-abc") }));
