import { Grid, Typography } from '@mui/material';
import { Fragment } from 'react';

import { theCrewLogo } from '../../../assets/icons';
import style from './about-us.module.scss';

const phrases = [
  {
    label: 'We Are',
    logo: 'https://unfold.co/wp-content/uploads/we-are.png',
    words: [
      'Humans',
      'Branding Experts',
      'Strategists',
      'Designers',
      'Illustrators',
      'Consultants',
      'Front-End Developers',
      'Artists',
      'Collaborators',
      'Specialists',
    ],
  },
  {
    label: 'We Are Not',
    logo: 'https://unfold.co/wp-content/uploads/we-are-not.png',
    words: [
      'Robots',
      'Corporate',
      'In SF',
      'Dinosaurs',
      'Freelancers',
      'Cookie Cutters',
      'Your Mama',
    ],
  },
  {
    label: 'What We Do',
    logo: 'https://unfold.co/wp-content/uploads/what-we-do.png',
    words: [
      'Brand Audit & Research',
      'Brand Strategy & Positioning',
      'Naming',
      'UI / UX',
      'Web & Mobile Apps',
      'Visual Identity Design',
      'Brand Guidelines',
      'Brand Voice & Messaging',
      'Packaging Design',
      'Print Collateral',
      'Illustration',
    ],
  },
];

const AboutUs = () => {
  return (
    <Grid container flex={1} flexDirection="column">
      <div className={style.imgContainer} style={{}}>
        <div className={style.branding}>
          <img src={theCrewLogo} alt="the-crew-logo" className={style.crewLogo} />
          <Typography variant="h1" fontWeight="bold">
            the crew
          </Typography>
          <Typography variant="subtitle1">
            Hand crafting award winning digital services experiences
          </Typography>
        </div>
      </div>
      <div className={style.brandingMotto}>
        <Grid
          container
          flexDirection="column"
          rowSpacing={4}
          marginLeft="40%"
          maxWidth="500px"
          width="auto"
        >
          <Grid item>
            <Typography variant="h4" fontWeight="bold" color="rgb(68, 68, 68)">
              Building awesome,
              <br />
              One service at a time
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" color="rgb(103, 103, 103)">
              We strategically design beautiful brands, websites, and digital products that actually
              work. Creating a product that connects with your target group is essential for
              success, and we know how to do it.
            </Typography>
          </Grid>
        </Grid>
      </div>
      <div className={style.whoWeAre}>
        <Grid container style={{ maxWidth: '1000px', margin: 'auto' }}>
          {phrases.map((item, index) => {
            return (
              <Grid
                key={index}
                item
                container
                xs
                flexDirection="column"
                rowSpacing={2}
                padding="6%"
                style={{
                  backgroundColor: index % 2 === 0 ? 'rgba(202, 209, 217, 0.2)' : '#fff',
                }}
              >
                <Grid item container columnSpacing={1} alignItems="center">
                  <Grid item>
                    <img src={item.logo} alt="logo" height="24px" width="auto" />
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" color="rgb(68, 68, 68)">
                      {item.label}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography variant="body1" color="rgb(103, 103, 103)">
                    {item.words.map((word, nestedIndex) => {
                      return (
                        <Fragment key={nestedIndex}>
                          {word}
                          <br />
                        </Fragment>
                      );
                    })}
                  </Typography>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </div>
    </Grid>
  );
};

export default AboutUs;
