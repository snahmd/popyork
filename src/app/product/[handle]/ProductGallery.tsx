'use client';

import { useState, useEffect } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from 'next/image';
import { GridTileImage } from '@/components/grid/tile';
import { useRouter, useSearchParams } from 'next/navigation';

interface ProductGalleryProps {
    images: Array<{
        url: string;
    }>;
    title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const imageIndex = searchParams.get('image'); // url?image=1
    const [currentIndex, setCurrentIndex] = useState(imageIndex ? parseInt(imageIndex) : 0);

    useEffect(() => {
        if (imageIndex) {
            setCurrentIndex(parseInt(imageIndex));
        }
    }, [imageIndex]);

    const updateURL = (index: number) => {
        const params = new URLSearchParams(searchParams.toString()); // url?image=1&other=2
        params.set('image', index.toString());
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const nextSlide = () => {
        console.log("nextSlide:")
        console.log(currentIndex)
        console.log("---")
        const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
        updateURL(newIndex);
    };

    const prevSlide = () => {
        console.log("prevSlide:")
        console.log(currentIndex)
        console.log("---")
        const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
        updateURL(newIndex);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        updateURL(index);
    };

    if (!images?.length) return null;

    return (
        <form>
            <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
                { images[currentIndex] && (
                    <Image
                        className="h-full w-full object-contain"
                        fill
                        sizes="(min-width: 1024px) 66vw, 100vw"
                        src={ images[currentIndex]?.url as string }
                        alt={ title }
                        priority={ true }
                    />
                ) }

                { images.length > 1 ? (
                    <div className="absolute bottom-[15%] flex w-full justify-center">
                        <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur dark:border-black dark:bg-neutral-900/80">
                            <button
                                formAction={ () => {
                                    prevSlide()
                                } }
                                aria-label="Previous product image"
                                className={ "h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center" }
                            >
                                <ArrowLeftIcon className="h-5" />
                            </button>
                            <div className="mx-1 h-6 w-px bg-neutral-500"></div>
                            <button
                                formAction={ () => {
                                    nextSlide()
                                } }
                                aria-label="Next product image"
                                className={ "h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center" }
                            >
                                <ArrowRightIcon className="h-5" />
                            </button>
                        </div>
                    </div>
                ) : null }
            </div>
            { images.length > 1 ? (
                <ul className="my-12 flex items-center justify-center gap-2 overflow-auto py-1 lg:mb-0">
                    { images.map((image, index) => {
                        const isActive = index === currentIndex;
                        return (
                            <li key={ image.url } className="h-20 w-20">
                                <button
                                    formAction={ () => {
                                        goToSlide(index)
                                    } }
                                    aria-label="Select product image"
                                    className="h-full w-full"
                                >
                                    <GridTileImage
                                        alt={ title }
                                        src={ image.url }
                                        active={ isActive }
                                        width={ 80 }
                                        height={ 80 }
                                    />
                                </button>
                            </li>
                        );
                    }) }
                </ul>
            ) : null }
        </form>
    );
} 