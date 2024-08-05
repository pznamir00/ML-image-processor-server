import { checkImageExistsByName } from "../gateways/image.gateway";

export const validateImageName = async function (name: string) {
  const exists = await checkImageExistsByName(name);

  if (!exists) {
    throw new Error(`Image with name ${name} doesn't exist`);
  }
};
