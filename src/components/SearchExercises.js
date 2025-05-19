import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { exerciseOptions, fetchData } from '../utils/fetchData';
import HorizontalScrollbar from './HorizontalScrollbar';

const SearchExercises = ({setExercises, bodyPart, setBodyPart}) => {
  
  const [search, setSearch] = useState('');
  const [bodyParts, setBodyParts] = useState([]);

useEffect(() => {
  const fetchExercisesData = async () => {
    try {
      const bodyPartsData = await fetchData(
        'https://exercisedb.p.rapidapi.com/exercises/bodyPartList',
        exerciseOptions
      );
        setBodyParts(['all', ...bodyPartsData]);
    } 
    catch (error) {
      console.error("API Fetch Error:", error);
    }
  };

  fetchExercisesData();
}, []);


const handleSearch = async () => {
  if (search) {
    const exercisesData = await fetchData('https://exercisedb.p.rapidapi.com/exercises', exerciseOptions);

    let searchedExercises;

    // Check if the search matches a bodyPart directly
    const lowerSearch = search.toLowerCase();
    if (bodyParts.includes(lowerSearch)) {
      // If it's one of the body parts, filter like clicking the card
      searchedExercises = exercisesData.filter(
        (exercise) => exercise.bodyPart.toLowerCase() === lowerSearch
      );
      setBodyPart(lowerSearch); // Optional: also select the category visually
    } else {
      // Default text search behavior
      searchedExercises = exercisesData.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(lowerSearch) ||
          exercise.target.toLowerCase().includes(lowerSearch) ||
          exercise.equipment.toLowerCase().includes(lowerSearch) ||
          exercise.bodyPart.toLowerCase().includes(lowerSearch)
      );
    }

    setSearch('');
    setExercises(searchedExercises);
  }
};


  // const handleSearch = async () => {
  //   if (search) {
  //     const exercisesData = await fetchData('https://exercisedb.p.rapidapi.com/exercises', exerciseOptions);

  //     const searchedExercises = exercisesData.filter(
  //       (exercise) => exercise.name.toLowerCase().includes(search)
  //              || exercise.target.toLowerCase().includes(search)
  //              || exercise.equipment.toLowerCase().includes(search)
  //              || exercise.bodyPart.toLowerCase().includes(search),
  //     );

  //     setSearch('');
  //     setExercises(searchedExercises);
  //   }
  // };

  return (
    <Stack alignItems="center" mt="37px" justifyContent="center" p="20px">
      <Typography fontWeight={700} sx={{ fontSize: { lg: '44px', xs: '30px' } }} mb="50px" textAlign="center">
        Awesome Exercises You <br /> Should Know
      </Typography>
      <Box position="relative" mb="72px">
        <TextField
          height="76px"
          sx={{
             input: {
                fontWeight: '700',
                border: 'none',
                borderRadius: '4px' 
            },
             width: { lg: '1170px', xs: '350px' },
              backgroundColor: '#fff', borderRadius: '40px' 
            }}
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          //enter key to send:
          onKeyDown={(e) => {
          if (e.key === 'Enter') {
          handleSearch(); // Trigger search on Enter key
          }
          }}
          placeholder="Search by body part, exercise or equipment"
          type="text"
        />
        <Button className="search-btn" 
        sx={{
            bgcolor: '#FF2625',
            color: '#fff',
            textTransform: 'none',
            width: { lg: '173px', xs: '80px' },
            height: '56px',
            position: 'absolute',
            right: '0px',
            fontSize: { lg: '20px', xs: '14px' }
            }}
            onClick={handleSearch}>
          Search
        </Button>
      </Box>
      <Box sx={{ position: 'relative', width: '100%', p: '20px' }}>
        <HorizontalScrollbar data={bodyParts} bodyPart={bodyPart} setBodyPart={setBodyPart} isBodyParts/>
      </Box>
    </Stack>
  );
};

export default SearchExercises;