export const useSeo = (options: {
  title?: string;
  description?: string | null;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  jsonLd?: Record<string, any>; // 支持 JSON-LD
}) => {
  const config = useRuntimeConfig();

  // 兜底为 string，避免 undefined
  const siteName = config.public?.siteName ?? "花语商城";
  const defaultDesc = config.public?.defaultDescription ?? "";
  const defaultImage = config.public?.defaultImage ?? "";
  const siteUrl = config.public?.siteUrl ?? "";

  const title =
    options.title && options.title.trim().length
      ? `${options.title} - ${siteName}`
      : siteName;

  const description = options.description ?? defaultDesc;
  const image = options.image ?? defaultImage;
  const url = options.url ?? (siteUrl as string);
  const ogType = options.type ?? "website";

  const meta: Array<Record<string, string>> = [
    { name: "description", content: description },
    { name: "keywords", content: `${options.title ?? ""},鲜花,鲜花速递,送花` },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:type", content: ogType },
    { property: "og:url", content: url },
  ];

  const link: Array<Record<string, string>> = [{ rel: "canonical", href: url }];

  const script: Array<{ type: string; children: string }> = options.jsonLd
    ? [
        {
          type: "application/ld+json",
          children: JSON.stringify(options.jsonLd),
        },
      ]
    : [];

  useHead({
    title,
    meta,
    link,
    script,
  });
};
