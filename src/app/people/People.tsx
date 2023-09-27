'use client';
import React, { useState, useEffect } from 'react';
import gif from 'public/star_wars_loading.gif';
import not_found from 'public/not_found.png';
import Image from 'next/image';
import PersonCard from '../components/Person/PersonCard/PersonCard';
import PersonModal from '../components/Person/PersonModal/PersonModal';
import { Person } from '../interfaces';
import { Autocomplete, TextField } from '@mui/material';
import useLoadPeople from './useLoadPeople';

export default function People() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedPerson, setSelectedPerson] = useState<Person | undefined>();
    const { people, isLoading, isError, handleSearchChange } = useLoadPeople();

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center place-items-center h-screen w-screen">
                <Image priority alt="loading" src={gif} height={150} width={150} />
                <h1>LOADING</h1>
            </div>
        );
    }

    if (isError) {
        return(
            <div className="flex flex-col justify-center place-items-center h-screen w-screen">
                <Image priority alt="loading" src={not_found} layout='raw' />
            </div>
        )
    }

    return (
        <div className="flex flex-col place-items-center">
            <Autocomplete
                freeSolo
                disableClearable
                options={people?.map((option) => option.name) ?? []}
                className="w-1/3 mt-4 mb-4"
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search input"
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',
                        }}
                        onChange={handleSearchChange}
                    />
                )}
            />
            {people?.map((person, index) => (
                <PersonCard
                    key={index}
                    name={person.name}
                    onClick={() => {
                        setSelectedPerson(person);
                        setIsModalOpen(true);
                    }}
                />
            ))}
            {isModalOpen && <PersonModal
                isOpen={isModalOpen}
                onClose={() => {
                    setSelectedPerson(undefined);
                    setIsModalOpen(false);
                }}
                person={selectedPerson}
            />}
        </div>
    );
}
