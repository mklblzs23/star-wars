'use client';
import React, { useEffect, useState } from 'react';
import styles from './PersonCard.module.css';
import svg from 'public/luke-skywalker-lightsaber-svgrepo-com.svg';
import gif from 'public/star_wars_loading.gif';
import not_found from 'public/not_found.png';
import Image, { StaticImageData } from 'next/image';

interface PersonCardProp {
    name: string,
    onClick: () => void,
};

const PersonCard = (props: PersonCardProp) => {
    const { name, onClick } = props;
    const [imageUrl, setImageUrl] = useState<string | StaticImageData>();

    useEffect(() => {
        let isCancelled = false;

        async function loadPicture() {
            await fetch('https://picsum.photos/200/300')
            .then((response) => {
                if (!isCancelled) {
                    if (response.status == 404) {
                        setImageUrl(not_found);
                    } else {
                        setImageUrl(response.url);
                    }
                }
            })
            .catch((error) => console.log(error));
        }

        loadPicture();
        return () => {
            isCancelled = true;
        }
    }, []);

    return (
        <div className="flex w-1/3 justify-center place-items-center">
            <Image
                priority
                src={svg}
                height={60}
                width={60}
                alt="lightsaber"
                className="rotate-45 mr-1"
            />
            <button className={styles.animatedButton} onClick={onClick}>
                {name}
            </button>
            <Image
                priority
                src={imageUrl ? imageUrl : gif}
                alt="Random image"
                height={40}
                width={40}
                layout="fixed"
            />
        </div>
    )
}

export default React.memo(PersonCard)
