interface GammaDataPoint {
    Alcohol: string;
    Flavanoids: string | number;
    Ash: string | number;
    Hue: string | number;
    Magnesium: string | number;
    Gamma?: number;
}

const gammaFetchData = async (dataFilePath: string): Promise<GammaDataPoint[]> => {
    try {
        const response = await fetch(dataFilePath);
        const data: GammaDataPoint[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

const convertToNumber = (value: string | number | undefined): number => {
    if (typeof value === 'string') {
        const parsedValue = parseFloat(value);
        return isNaN(parsedValue) ? 0 : parsedValue;
    } else if (typeof value === 'number') {
        return value;
    } else {
        return 0;
    }
};

const calculateGamma = (data: GammaDataPoint[]): GammaDataPoint[] => {
    return data.map((datapoint) => {
        const ash = convertToNumber(datapoint.Ash);
        const hue = convertToNumber(datapoint.Hue);
        const magnesium = convertToNumber(datapoint.Magnesium);
        const gamma = magnesium !== 0 ? (ash * hue) / magnesium : 0;

        return {
            ...datapoint,
            Gamma: Number(gamma.toFixed(3)),
        };
    });
};

const gammaCalculateClassWiseMean = (data: GammaDataPoint[]): Record<string, number> => {

    const classData: Record<string, number[]> = {};

    // Pre-process the data and group the flavanoid values by class
    for (const datapoint of data) {
        const className = datapoint.Alcohol;
        const gamma = typeof datapoint.Gamma === 'string' ? Number(datapoint.Gamma) : datapoint.Gamma;

        if (classData[className]) {
            classData[className].push(convertToNumber(gamma));
        } else {
            classData[className] = [convertToNumber(gamma)];
        }
    }

    const classMean: Record<string, number> = {};

    // Calculate the mean for each class
    for (const className in classData) {
        const gammaValues = classData[className];
        const sum = gammaValues.reduce((acc, val) => acc + val, 0);
        const mean = sum / gammaValues.length;
        classMean[className] = Number(mean.toFixed(3)); // Limit mean value to 3 decimals
    }

    return classMean;
};

const gammaCalculateClassWiseMedian = (data: GammaDataPoint[]): Record<string, number> => {
    const classMedian: Record<string, number> = {};

    for (const className of new Set(data.map((datapoint) => datapoint.Alcohol))) {
        const classData = data.filter((datapoint) => datapoint.Alcohol === className);
        const gammaValues = classData.map((datapoint) => datapoint.Gamma || 0);
        const sortedValues = gammaValues.sort((a, b) => a - b);
        const medianIndex = Math.floor(sortedValues.length / 2);
        const median = sortedValues.length % 2 === 0 ? (sortedValues[medianIndex - 1] + sortedValues[medianIndex]) / 2 : sortedValues[medianIndex];
        classMedian[className] = median;
    }

    return classMedian;
};

const gammaCalculateClassWiseMode = (data: GammaDataPoint[]): Record<string, number[]> => {
    const classMode: Record<string, number[]> = {};

    for (const className of new Set(data.map((datapoint) => datapoint.Alcohol))) {
        const classData = data.filter((datapoint) => datapoint.Alcohol === className);
        const gammaValues = classData.map((datapoint) => datapoint.Gamma || 0);
        const valueCounts: Record<number, number> = {};

        for (const value of gammaValues) {
            if (valueCounts[value]) {
                valueCounts[value]++;
            } else {
                valueCounts[value] = 1;
            }
        }

        const maxCount = Math.max(...Object.values(valueCounts));
        const mode = Object.entries(valueCounts)
            .filter(([value, count]) => count === maxCount)
            .map(([value]) => Number(value));

        classMode[className] = mode;
    }

    return classMode;
};


interface GammaClassWiseStatisticsProps {
    classMean: Record<string, number>;
    classMedian: Record<string, number>;
    classMode: Record<string, number[]>;
}

const GammaClassWiseStatistics = ({ classMean, classMedian, classMode }: GammaClassWiseStatisticsProps) => {

    return (
        <table>
            <thead>
                <tr>
                    <th>Measure</th>
                    {Object.keys(classMean).map((className) => (
                        <th key={className}>Class {className}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Gamma Mean</td>
                    {Object.keys(classMean).map((className) => (
                        <td key={className}>{classMean[className].toFixed(3)}</td>
                    ))}
                </tr>
                <tr>
                    <td>Gamma Median</td>
                    {Object.keys(classMedian).map((className) => (
                        <td key={className}>{classMedian[className].toFixed(3)}</td>
                    ))}
                </tr>
                <tr>
                    <td>Gamma Mode</td>
                    {Object.keys(classMode).map((className) => (
                        <td key={className}>{classMode[className][0].toFixed(3)}</td>
                    ))}
                </tr>
            </tbody>
        </table>
    );
};



export { GammaClassWiseStatistics, gammaCalculateClassWiseMean, gammaCalculateClassWiseMode, gammaCalculateClassWiseMedian, calculateGamma, gammaFetchData }