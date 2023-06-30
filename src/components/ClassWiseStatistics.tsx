import React from 'react';

interface DataPoint {
    Alcohol: string;
    Flavanoids: number | string;
}

const fetchData = async (dataFilePath: string): Promise<DataPoint[]> => {
    try {
        const response = await fetch(dataFilePath);
        const data: DataPoint[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

const calculateClassWiseMean = (data: DataPoint[]): Record<string, number> => {
    const classData: Record<string, number[]> = {};

    // Pre-process the data and group the flavanoid values by class
    for (const datapoint of data) {
        const className = datapoint.Alcohol;
        const flavanoids = typeof datapoint.Flavanoids === 'string' ? Number(datapoint.Flavanoids) : datapoint.Flavanoids;

        if (classData[className]) {
            classData[className].push(flavanoids);
        } else {
            classData[className] = [flavanoids];
        }
    }

    const classMean: Record<string, number> = {};

    // Calculate the mean for each class
    for (const className in classData) {
        const flavanoidValues = classData[className];
        const sum = flavanoidValues.reduce((acc, val) => acc + val, 0);
        const mean = sum / flavanoidValues.length;
        classMean[className] = Number(mean.toFixed(3)); // Limit mean value to 3 decimals
    }

    return classMean;
};




const calculateClassWiseMedian = (data: DataPoint[]): Record<string, number> => {
    const classData: Record<string, number[]> = {};

    // Pre-process the data and group the flavanoid values by class
    for (const datapoint of data) {
        const className = datapoint.Alcohol;
        const flavanoids = typeof datapoint.Flavanoids === 'string' ? Number(datapoint.Flavanoids) : datapoint.Flavanoids;

        if (classData[className]) {
            classData[className].push(flavanoids);
        } else {
            classData[className] = [flavanoids];
        }
    }

    const classMedian: Record<string, number> = {};

    // Calculate the median for each class
    for (const className in classData) {
        const flavanoidValues = classData[className];
        const sortedValues = flavanoidValues.sort((a, b) => a - b);
        const medianIndex = Math.floor(sortedValues.length / 2);
        const median = sortedValues.length % 2 === 0 ? (sortedValues[medianIndex - 1] + sortedValues[medianIndex]) / 2 : sortedValues[medianIndex];
        classMedian[className] = Number(median.toFixed(3)); // Limit median value to 3 decimals
    }

    return classMedian;
};

const calculateClassWiseMode = (data: DataPoint[]): Record<string, number[]> => {
    const classData: Record<string, number[]> = {};

    // Pre-process the data and group the flavanoid values by class
    for (const datapoint of data) {
        const className = datapoint.Alcohol;
        const flavanoids = typeof datapoint.Flavanoids === 'string' ? Number(datapoint.Flavanoids) : datapoint.Flavanoids;

        if (classData[className]) {
            classData[className].push(flavanoids);
        } else {
            classData[className] = [flavanoids];
        }
    }

    const classMode: Record<string, number[]> = {};

    // Calculate the mode for each class
    for (const className in classData) {
        const flavanoidValues = classData[className];
        const valueCounts: Record<number, number> = {};

        // Count occurrences of each value
        for (const value of flavanoidValues) {
            const numericValue = Number(value); // Convert string to number if necessary
            if (valueCounts[numericValue]) {
                valueCounts[numericValue]++;
            } else {
                valueCounts[numericValue] = 1;
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


interface ClassWiseStatisticsProps {
    classMean: Record<string, number>;
    classMedian: Record<string, number>;
    classMode: Record<string, number[]>;
}

const ClassWiseStatistics: React.FC<ClassWiseStatisticsProps> = ({
    classMean,
    classMedian,
    classMode,
}) => {
    return (
        <table style={{ borderCollapse: 'collapse' }}>
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
                    <td>Flavanoids Mean</td>
                    {Object.values(classMean).map((mean, index) => (
                        <td key={index}>{mean}</td>
                    ))}
                </tr>
                <tr>
                    <td>Flavanoids Median</td>
                    {Object.values(classMedian).map((median, index) => (
                        <td key={index}>{median}</td>
                    ))}
                </tr>
                <tr>
                    <td>Flavanoids Mode</td>
                    {Object.keys(classMode).map((className) => (
                        <td key={className}>{classMode[className][0]}</td>
                    ))}
                </tr>
            </tbody>
        </table>
    );
};

export { ClassWiseStatistics, calculateClassWiseMean, calculateClassWiseMode, calculateClassWiseMedian, fetchData }