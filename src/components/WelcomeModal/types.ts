interface BaseCardType {
  title?: string;
  subtitle?: string;
  description: string;
  href?: string;
}

interface ImageCardType extends BaseCardType {
  img?: string;
}

interface VideoCardType extends BaseCardType {
  video?: string;
}

export type { ImageCardType, VideoCardType };
