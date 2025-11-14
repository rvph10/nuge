import Image from "next/image";

/**
 * Animation duration for a complete cycle.
 * Slowed down for a more elegant visual effect.
 */
const ANIMATION_SPEED = "240s";

/**
 * Master list of 22 unique images for the hero wall animation.
 * Images are distributed across 4 columns with varying quantities for visual interest.
 */
const MASTER_IMAGE_LIST = [
  // Column 1 (5 images)
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-1.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-2.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-3.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-4.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-5.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-1.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-2.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-3.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-4.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-5.jpg",

  // Column 2 (7 images)
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-6.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-7.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-8.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-9.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-10.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-11.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-12.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-6.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-7.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-8.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-9.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-10.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-11.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-12.jpg",

  // Column 3 (6 images)
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-13.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-14.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-15.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-16.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-17.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-18.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-13.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-14.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-15.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-16.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-17.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-18.jpg",

  // Column 4 (4 images)
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-19.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-20.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-21.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-22.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-19.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-20.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-21.jpg",
  "https://yynydcuzvqlniyqwafqo.supabase.co/storage/v1/object/public/Public%20App%20File/wall-22.jpg",
];

/**
 * Card Component
 *
 * Displays a single image card in the hero wall animation.
 * Now uses Next.js Image component for automatic optimization.
 *
 * Performance improvements:
 * - Automatic image optimization and WebP conversion
 * - Lazy loading for off-screen images
 * - Responsive image sizing
 * - Better caching
 *
 * @param imageUrl - Path to the image to display
 * @param priority - Whether to prioritize loading this image (for above-the-fold content)
 */
type CardProps = {
  imageUrl: string;
  priority?: boolean;
};

const Card = ({ imageUrl, priority = false }: CardProps) => {
  return (
    <div className="w-56 shrink-0 rounded-2xl overflow-hidden shadow-xl relative aspect-[4/5]">
      <Image
        src={imageUrl}
        alt="Hero wall decorative image"
        fill
        sizes="224px"
        className="object-cover"
        priority={priority}
        loading={priority ? undefined : "lazy"}
      />
    </div>
  );
};

/**
 * Column Component
 *
 * Creates a vertically scrolling column of images.
 * Duplicates the image set to create a seamless infinite loop effect.
 *
 * Performance optimization:
 * - Prioritizes loading the first 2 images in each column (visible above the fold)
 * - Lazy loads remaining images to reduce initial page load
 *
 * @param images - Array of image paths for this column
 * @param animationName - CSS animation name (move-up or move-down)
 */
type ColumnProps = {
  images: string[];
  animationName: string;
};

const Column = ({ images, animationName }: ColumnProps) => {
  // Prioritize first 2 images (likely visible on initial load)
  const firstSet = images.map((src, i) => (
    <Card key={`first-${i}`} imageUrl={src} priority={i < 2} />
  ));
  // Second set is always lazy loaded (for infinite scroll)
  const secondSet = images.map((src, i) => (
    <Card key={`second-${i}`} imageUrl={src} priority={false} />
  ));

  return (
    <div
      className="flex flex-col gap-6"
      style={{
        animation: `${animationName} ${ANIMATION_SPEED} linear infinite`,
      }}
    >
      {firstSet}
      {secondSet}
    </div>
  );
};

/**
 * HeroWall Component
 *
 * Main component that creates an animated wall of images for the login page hero section.
 * Features four columns of images that scroll infinitely in alternating directions,
 * rotated at 45 degrees for visual interest.
 *
 * The master image list is sliced into four columns to ensure each image is unique.
 */
export const HeroWall = () => {
  // Slice the master list to distribute images across columns
  const col1Images = MASTER_IMAGE_LIST.slice(0, 10); // 5 images
  const col2Images = MASTER_IMAGE_LIST.slice(10, 24); // 7 images
  const col3Images = MASTER_IMAGE_LIST.slice(24, 36); // 6 images
  const col4Images = MASTER_IMAGE_LIST.slice(36, 44); // 4 images

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Le conteneur rotaté avec les colonnes */}
      <div
        className="absolute inset-0 flex rotate-45 transform items-center 
                   justify-center gap-6 p-8 md:scale-125"
      >
        <Column images={col1Images} animationName="move-up" />
        <Column images={col2Images} animationName="move-down" />
        <Column images={col3Images} animationName="move-up" />
        <Column images={col4Images} animationName="move-down" />
      </div>
    </div>
  );
};
