// Generated server types stub for Convex
import { GenericActionCtx, GenericMutationCtx, GenericQueryCtx } from "convex/server";

export type QueryCtx = GenericQueryCtx<any>;
export type MutationCtx = GenericMutationCtx<any>;
export type ActionCtx = GenericActionCtx<any>;

export function query<Args extends Record<string, any>, Output>(config: {
  args?: any;
  handler: (ctx: QueryCtx, args: Args) => Promise<Output>;
}) {
  return config;
}

export function mutation<Args extends Record<string, any>, Output>(config: {
  args?: any;
  handler: (ctx: MutationCtx, args: Args) => Promise<Output>;
}) {
  return config;
}

export function action<Args extends Record<string, any>, Output>(config: {
  args?: any;
  handler: (ctx: ActionCtx, args: Args) => Promise<Output>;
}) {
  return config;
}
