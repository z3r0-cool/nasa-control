import { join } from "https://deno.land/std/path/mod.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";
import { parse } from "https://deno.land/std/encoding/csv.ts";
import * as log from "https://deno.land/std/log/mod.ts";
import _ from "https://deno.land/x/deno_lodash/mod.ts";

type Planet = Record<string, string>;

let planets: Array<Planet>;

export function filterHabitablePlanets(planets: Array<Planet>) {
  return planets.filter((planet) => {
    const planetaryRadius = Number(planet["koi_prad"]);
    const stellarMass = Number(planet["koi_smass"]);
    const stellarRadius = Number(planet["koi_srad"]);

    return planet["koi_disposition"] === "CONFIRMED" &&
      planetaryRadius > 0.5 && planetaryRadius < 1.5 &&
      stellarMass > 0.78 && stellarMass < 1.04 &&
      stellarRadius > 0.99 && stellarRadius < 1.01;
  });
}

async function loadPlanetsData() {
  const path = join("data", "original.csv");

  const file = await Deno.open(path);
  const bufReader = new BufReader(file);

  const result = await parse(bufReader, {
    header: true,
    comment: "#",
  });
  //avoid leak resource
  Deno.close(file.rid);

  const planets = filterHabitablePlanets(result as Array<Planet>);

  return planets.map((planet) => {
    return _.pick(planet, [
      "koi_prad",
      "koi_smass",
      "koi_srad",
      "kepler_name",
      "koi_count",
      "koi_steff",
      "koi_period",
    ]);
  });
}

planets = await loadPlanetsData();
log.info(`${planets.length} habitable planets`);

export function getAllPlanets() {
  return planets;
}