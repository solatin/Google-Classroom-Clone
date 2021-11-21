import React from 'react';
import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import "./Assignments.css";

const Assignments = () => {
    return(
        <Card sx={{ maxWidth: 1000, maxHeight: 300, borderRadius: 2 }}>
			<CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
					<Typography
						color="black"
						sx={{
							cursor: 'pointer',
							'&:hover': {
								textDecoration: 'underline'
							},
							fontSize: 16
						}}  
					>
                    <img src="/static/notebook.svg" alt="" />
						Assignments
					</Typography>
				</Box>
			</CardContent>
		</Card>
    );
    
}

export default Assignments;