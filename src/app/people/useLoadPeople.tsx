import { useEffect, useState } from "react";
import { Person } from "../interfaces";
import { debounce } from "lodash";

export default function useLoadPeople() {
    const [people, setPeople] = useState<Person[] | undefined>();
    const [filteredPeople, setFilteredPeople] = useState<Person[] | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    
    useEffect(() => {
        let isCancelled = false;

        async function loadPeople() {
            await fetch('https://swapi.dev/api/people/')
            .then(response => response.json())
            .then((data) => {
                if (!isCancelled) {
                    const detail = data.detail;
                    if (detail) {
                        setIsError(true);
                        setIsLoading(false);
                    } else {
                        const result = data.results;
                        const resultPeople = result?.map((person: { name: string; height: number; mass: number; birth_year: string; films: string[]; homeworld: string; }) => ({
                            name: person.name,
                            height: person.height,
                            weight: person.mass,
                            birthDate: person.birth_year,
                            filmCount: person.films?.length,
                            homeWorld: person.homeworld,
                        }));
                        setPeople(resultPeople);
                        setFilteredPeople(resultPeople);
                        setIsLoading(false);
                    }
                }
            })
            .catch(() => {
                setIsError(true);
                setIsLoading(false);
            });
        }

        loadPeople();

        return () => {
            isCancelled = true;
        }        
    }, []);

    const debounceSearch = debounce((searchValue) => {
        if (!searchValue) {
            setFilteredPeople(people);
        }
        const filteredResults = people?.filter((person) =>
            person.name.toLowerCase().includes(searchValue.toLowerCase())
        );
    
        setFilteredPeople(filteredResults);
    }, 300);

    function handleSearchChange(event: { target: { value: any; }; }) {
        const inputText = event?.target?.value;
        debounceSearch(inputText);
    };

    return {
        people: filteredPeople,
        isLoading,
        isError,
        handleSearchChange,
    };
}
