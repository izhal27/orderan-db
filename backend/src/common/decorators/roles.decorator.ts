import { SetMetadata } from "@nestjs/common";
import { ROLES_KEY } from "../../types/constants";

export const Roles = (...roles) => SetMetadata(ROLES_KEY, roles);
