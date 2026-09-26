const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "piccollage-assignment";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: isGithubPages ? `/${repoName}` : "",
  assetPrefix: isGithubPages ? `/${repoName}/` : "",
  images: { unoptimized: true },
};

export default nextConfig;
