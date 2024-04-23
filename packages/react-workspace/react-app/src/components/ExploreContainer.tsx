import './ExploreContainer.css';
import { MyComponent } from '@mawhea/stencil-library-react';

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  return (
    <div id="container">
      <strong>{name}</strong>
      <p>Explore <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
      <MyComponent first="Your" last="Name" />
    </div>
  );
};

export default ExploreContainer;
