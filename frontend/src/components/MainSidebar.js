import { Box, Drawer, Typography } from '@mui/material';
import { LAYOUT } from 'src/configs/layout';
import PropTypes from 'prop-types';

const MainSidebar = ({ closeSideBar, isSideBarOpen }) => {
	return (
		<Drawer
			anchor="left"
			onClose={closeSideBar}
			open={isSideBarOpen}
			PaperProps={{
				sx: {
					backgroundColor: 'background.paper',
					width: LAYOUT.SIDEBAR_WIDTH
				}
			}}
			variant="temporary"
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%'
				}}
			>
				<Typography variant="h5">Sidebar</Typography>
			</Box>
		</Drawer>
	);
};

MainSidebar.propTypes = {
	closeSideBar: PropTypes.func.isRequired,
	isSideBarOpen: PropTypes.bool.isRequired
}

export default MainSidebar;