import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
    clientPrefix: "VITE_",
    client: {
        VITE_APP_API: z.string().url(),
    },
    runtimeEnv: import.meta.env,
});
