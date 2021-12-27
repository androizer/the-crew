import './homeStyles.scss';

import { Autocomplete, Grid, Slide, TextField, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/system';
import { Role, ServiceLocation } from '@the-crew/common/enums';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { assured, equipment, homeBanner, person, price } from '../../../assets/images/home';
import { authSelector } from '../../store/slices';

const whyTheCrewContent = [
  {
    img: price,
    heading: 'Transparent pricing',
    desc: 'See fixed prices before you book. No hidden charges.',
  },
  {
    img: person,
    heading: 'Experts only',
    desc: 'Our professionals are well trained and have on-job expertise.',
  },
  {
    img: equipment,
    heading: 'Fully equipped',
    desc: 'We bring everything needed to get the job done well.',
  },
];

export default function Home() {
  const theme = useTheme();
  const smView = useMediaQuery(theme.breakpoints.down('md'));
  const md2smView = useMediaQuery(theme.breakpoints.between('xs', 'md'));
  const history = useHistory();
  const user = useSelector(authSelector).user;

  useEffect(() => {
    user && user.role[0] === Role.PROFESSIONAL && history.push('/bookings');
  }, [history, user]);

  return (
    <div className="homeRoot">
      <Grid
        container
        className="homePageImgContainer"
        style={{ backgroundImage: `url(${homeBanner})` }}
        justifyContent={md2smView ? 'center' : 'flex-end'}
      >
        <Grid
          item
          container
          className="homeScreenTitleRoot"
          style={{ width: md2smView ? '100%' : '50%' }}
        >
          <Slide direction="up" in={true} timeout={1000}>
            <div className="titleRoot">
              <span className="title">THE CREW</span>
              <h1 className="typingEffect">Quality home services, on demand</h1>
              <p className="titleDesc">
                Experienced, hand-picked Professionals to serve you at your doorstep
              </p>
              <div className="homeScreenAutoSearchDiv">
                <p>Where do you need a service?</p>
                <Autocomplete
                  options={Object.values(ServiceLocation).map(city => ({ city }))}
                  getOptionLabel={option => option.city}
                  style={{ width: 300, overflow: 'hidden' }}
                  renderInput={params => (
                    <TextField
                      style={{ overflow: 'hidden' }}
                      {...params}
                      placeholder="Select your city"
                      variant="outlined"
                    />
                  )}
                  onChange={(_, value: { city: ServiceLocation }) => {
                    history.push({
                      pathname: 'search',
                      search: `city=${value.city}`,
                    });
                  }}
                />
              </div>
            </div>
          </Slide>
        </Grid>
      </Grid>
      <Grid
        container
        flexDirection="column"
        justifyContent="space-between"
        alignItems="flex-start"
        className="homePageContent"
      >
        <Grid item>
          <div className="whyTheCrewDiv">
            <h2>Why The Crew ?</h2>
          </div>
        </Grid>
        <Grid
          item
          container
          flexDirection={smView ? 'column' : 'row'}
          justifyContent={smView ? 'flex-start' : 'space-between'}
          alignItems={smView ? 'start' : 'center'}
          className="static-ui-elements"
        >
          <Grid item xs>
            <RenderWhyTheCrewHtml />
          </Grid>
          <Grid item container xs className="qualityAssuredRoot" spacing={2} flexWrap="nowrap">
            <Grid item className="qualityAssuredImgContainer">
              <img className="qualityAssuredImg" src={assured} alt="" />
            </Grid>
            <Grid item>
              <h3 className="qualityAssuredHeading">100% Quality Assured</h3>
              <p className="qualityAssuredDesc">
                If you don’t love our service, we will make it right.
              </p>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

const RenderWhyTheCrewHtml = () => {
  return (
    <ul>
      {whyTheCrewContent.map((x, i) => {
        return (
          <li key={i} style={{ marginBottom: '16px', listStyle: 'none' }}>
            <Grid container justifyContent="flex-start" alignItems="center" flexWrap="nowrap">
              <div className="whyTheCrewImgContainer">
                <div className="whyTheCrewImgTemplate">
                  <img className="whyTheCrewImg" src={x.img} alt="" />
                </div>
              </div>
              <div className="whyTheCrewInfo" style={{ padding: '0 8px' }}>
                <h3 className="WhyTheCrew__heading">{x.heading}</h3>
                <p className="WhyTheCrew__desc">{x.desc}</p>
              </div>
            </Grid>
          </li>
        );
      })}
    </ul>
  );
};
