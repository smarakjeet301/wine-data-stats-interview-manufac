import React, { useEffect, useState } from 'react';
import { ClassWiseStatistics, calculateClassWiseMean, calculateClassWiseMedian, calculateClassWiseMode, fetchData } from './components/ClassWiseStatistics';
import { GammaClassWiseStatistics, gammaCalculateClassWiseMean, gammaCalculateClassWiseMedian, gammaCalculateClassWiseMode, calculateGamma, gammaFetchData } from './components/GammaClassWiseStatistics';
interface DataPoint {
  Alcohol: string;
  Flavanoids: number | string;

}

interface GammaDataPoint {
  Alcohol: string;
  Flavanoids: string | number;
  Ash: string | number;
  Hue: string | number;
  Magnesium: string | number;
  Gamma?: number;
}

const App: React.FC = () => {
  const dataFilePath = './Wine-Data.json';
  const [data, setData] = useState<DataPoint[]>([]);
  const [gammaData, setGammaData] = useState<GammaDataPoint[]>([]);

  useEffect(() => {
    fetchData(dataFilePath).then((fetchedData) => {
      setData(fetchedData);
    });

    gammaFetchData(dataFilePath).then((fetchedData) => {
      setGammaData(fetchedData)
    })
  }, []);

  const classMean = calculateClassWiseMean(data);
  const classMedian = calculateClassWiseMedian(data);
  const classMode = calculateClassWiseMode(data);


  // Gamma Mean, Median, Mode
  const updatedData = calculateGamma(gammaData)
  const gammaClassMean = gammaCalculateClassWiseMean(updatedData)
  const gammaClassWiseMedian = gammaCalculateClassWiseMedian(updatedData)
  const gammaClassWiseMode = gammaCalculateClassWiseMode(updatedData)

  return (
    <div>
      <h1>Class-wise Statistics</h1>
      <ClassWiseStatistics classMean={classMean} classMedian={classMedian} classMode={classMode} />

      <h1>Gamma Class-wise Statistics</h1>
      <GammaClassWiseStatistics classMean={gammaClassMean} classMedian={gammaClassWiseMedian} classMode={gammaClassWiseMode} />
    </div>
  );
};

export default App;
