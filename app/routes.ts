import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("lessons", "routes/lessons.tsx"),
  route("custom", "routes/custom.tsx"),
  route("practice/:lang/:project", "routes/practice.tsx"),
] satisfies RouteConfig;
