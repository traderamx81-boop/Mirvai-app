// Convex API stub referencing the Convex query/mutation declarations
import * as properties from "../properties";
import * as requests from "../requests";
import * as settings from "../settings";

export const api = {
  properties: {
    list: "properties:list" as any,
    getById: "properties:getById" as any,
    add: "properties:add" as any,
    update: "properties:update" as any,
    remove: "properties:remove" as any,
  },
  requests: {
    list: "requests:list" as any,
    create: "requests:create" as any,
    setReviewed: "requests:setReviewed" as any,
    addTeamNotes: "requests:addTeamNotes" as any,
  },
  settings: {
    get: "settings:get" as any,
    update: "settings:update" as any,
  },
};
