import  clsx from 'clsx';

/**
 * Grid bileşeni - Izgara düzeninde öğeleri görüntülemek için kullanılan ana konteyner
 * 
 * Özellikler:
 * - Otomatik satır akışı ile ızgara düzeni oluşturur
 * - Öğeler arasında 4 birimlik boşluk bırakır (gap-4)
 * - ul elementi olarak render edilir
 * - Tüm standart HTML ul elementi özelliklerini destekler
 * - className prop'u ile özelleştirilebilir
 */
export default function Grid(props: React.ComponentProps<"ul">) {
    return (
        <ul {...props} className={(clsx("grid grid-flow-row gap-4"),props.className)}>
            {props.children}
        </ul>
    );
}

/**
 * GridItem bileşeni - Grid içerisindeki her bir öğeyi temsil eden bileşen
 * 
 * Özellikler:
 * - Kare şeklinde görüntülenir (aspect-square)
 * - Opaklık geçiş efekti içerir (transition-opacity)
 * - li elementi olarak render edilir
 * - Tüm standart HTML li elementi özelliklerini destekler
 * - className prop'u ile özelleştirilebilir
 */
export function GridItem(props: React.ComponentProps<"li">) {
    return (
        <li
            {...props}
            className={(clsx("aspect-square transition-opacity"),props.className)}
        >
            {props.children}
        </li>
    );
}

// Grid.Item olarak GridItem bileşenini Grid'e bağlıyoruz
// Bu sayede Grid.Item şeklinde kullanılabilir hale geliyor
Grid.Item = GridItem;