import { Router } from "https://deno.land/x/oak@v5.0.0/mod.ts";
import * as launches from "./models/launches.ts";

import * as planets from "./models/planets.ts";

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = `                  
    _ __   __ _ ___  __ _ 
   | '_   / _' / __|/ _' |
   | | | | (_|  __   (_| |
   |_| |_| __,_|___/ __,_|

      Misson Control API`;
});

router.get("/planets", (ctx) => {
  ctx.response.body = planets.getAllPlanets();
});

router.get("/launches", (ctx) => {
  ctx.response.body = launches.getAll();
});

router.get("/launches/:id", (ctx) => {
  if (ctx.params?.id) {
    const launchData = launches.getOne(Number(ctx.params.id));
    if (launchData) {
      ctx.response.body = launchData;
    } else {
      ctx.throw(400, "Launch with that ID doesn't exist");
    }
  }
});

router.delete("/launches/:id", (ctx) => {
  if (ctx.params?.id) {
    const result = launches.removeOne(Number(ctx.params.id));
    ctx.response.body = { success: result };
  }
});

router.post("/launches", async (ctx) => {
  const body = await ctx.request.body();

  launches.addOne(body.value);

  ctx.response.body = { success: true };
  ctx.response.status = 201;
});

export default router;