'use client';
import { Box, Modal } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from './PersonModal.module.css';
import { Person, Planet } from '@/app/interfaces';
import gif from 'public/star_wars_loading.gif';
import Image from 'next/image';

interface PersonModalProps {
    isOpen: boolean;
    onClose: () => void;
    person: Person | undefined;
}

const PersonModal = (props: PersonModalProps) => {
    const { onClose, isOpen, person } = props;
    const [planet, setPlanet] = useState<Planet | undefined>();
    const [isPlanetLoading, setIsPlanetLoading] = useState<boolean>(true);

    useEffect(() => {
        let isCancelled = false;

        async function loadPlanet(homeWorldUrl: string) {
            await fetch(homeWorldUrl)
                .then(response => response.json())
                .then((data) => {
                    if (!isCancelled) {
                        setPlanet({
                            name: data?.name,
                            terrain: data?.terrain,
                            climate: data?.climate,
                        });
                        setIsPlanetLoading(false);
                    }
                })
                .catch((e) => {
                    setIsPlanetLoading(false);
                    console.log(e);
                });
        }

        if (person?.homeWorld) {
            loadPlanet(person?.homeWorld);
            return () => {
                isCancelled = true;
            } 
        }
    }, [person?.homeWorld]);

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
        >
            <Box className={styles.personModal}>
                <div className="text-xl mb-4 font-bold">{person?.name ?? ''}</div>
                <div>
                    <div>Height: {person?.height} cm</div>
                    <div>Weight: {person?.weight} kg</div>
                    <div>Date of birth: {person?.birthDate}</div>
                    <div>Film count: {person?.filmCount}</div>
                    {isPlanetLoading ? (
                        <div className="flex place-items-center">
                            <Image
                                priority
                                src={gif}
                                alt="loading"
                                height={40}
                                width={40}
                                layout="fixed"
                            />
                        </div>
                    ) 
                    : (
                        <div>
                            Planet:
                            <div className="ml-4">Name: {planet?.name}</div>
                            <div className="ml-4">Terrain: {planet?.terrain}</div>
                            <div className="ml-4">Climate: {planet?.climate}</div>
                        </div>
                    )}
                </div>
            </Box>
        </Modal>
    );
}

export default PersonModal
