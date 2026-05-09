// src/modules/generator/cluster-coverage.engine.ts


// ==========================================
// 📊 TYPES
// ==========================================

export type ClusterInfo = {

  cluster: string;

  min: number;

  max: number;

  count: number;

  percentage: number;
};


// ==========================================
// 🧠 CLUSTER COVERAGE ENGINE
// ==========================================

export class ClusterCoverageEngine {


  // ==========================================
  // 🔥 CLUSTERS
  // ==========================================

  private static clusters = [

    {
      cluster: 'A',
      min: 0,
      max: 1999
    },

    {
      cluster: 'B',
      min: 2000,
      max: 3999
    },

    {
      cluster: 'C',
      min: 4000,
      max: 5999
    },

    {
      cluster: 'D',
      min: 6000,
      max: 7999
    },

    {
      cluster: 'E',
      min: 8000,
      max: 9999
    }
  ];


  // ==========================================
  // 📊 ANALYZE
  // ==========================================

  static analyze(
    numbers: string[]
  ): ClusterInfo[] {

    const total =
      numbers.length;

    const result:
      ClusterInfo[] = [];


    for (
      const cluster
      of this.clusters
    ) {

      const count =

        numbers.filter(n => {

          const value =
            Number(n);

          return (

            value >=
            cluster.min

            &&

            value <=
            cluster.max
          );

        }).length;


      result.push({

        cluster:
          cluster.cluster,

        min:
          cluster.min,

        max:
          cluster.max,

        count,

        percentage:

          total > 0

            ?

            Number(

              (
                (
                  count / total
                ) * 100
              ).toFixed(2)
            )

            : 0
      });
    }

    return result;
  }


  // ==========================================
  // 🧠 GET LIGHTEST CLUSTER
  // ==========================================

  static getLightestCluster(
    numbers: string[]
  ) {

    const analyzed =
      this.analyze(numbers);

    return analyzed.sort(
      (a, b) =>
        a.count - b.count
    )[0];
  }


  // ==========================================
  // 🎲 GENERATE INSIDE CLUSTER
  // ==========================================

  static generateInsideCluster(

    min: number,

    max: number
  ) {

    return Math.floor(

      Math.random() *

      (
        max - min
      )

    ) + min;
  }
}