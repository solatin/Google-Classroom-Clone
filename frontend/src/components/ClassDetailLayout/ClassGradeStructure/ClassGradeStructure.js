import React from "react";
import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import "./ClassGradeStructure.css";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import authAxios from "src/utils/authAxios";

const ClassGradeStructure = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // get data from BE



  const handleClickGradeStruc = () => {
    navigate(`/class-details/${id}/grade/structure`);
  }

  return (
    <div>
      <Card sx={{ maxWidth: 300, maxHeight: 500, borderRadius: 2, margin: 2 }}>
			<CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
					<Typography
						color="black"
						sx={{
							cursor: 'pointer',
							'&:hover': {
								textDecoration: 'underline'
							},
							fontSize: 16
						}}  
                        onClick={() => handleClickGradeStruc()}
					>
						Grade Structure
					</Typography>
				</Box>
			</CardContent>
		</Card>
    </div>
  );
}
export default ClassGradeStructure;