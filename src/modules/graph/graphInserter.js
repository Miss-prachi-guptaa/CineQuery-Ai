import { getSession } from "../../config/neo4j.js";

export const insertMovie = async (movie) => {
  const session = getSession();

  try {
    await session.run(
      `
      MERGE (m:Movie {title: $title})
      SET m.year = $year

      MERGE (d:Person {name: $director})
      MERGE (m)-[:DIRECTED_BY]->(d)

      FOREACH (actor IN $actors |
        MERGE (a:Person {name: actor})
        MERGE (a)-[:ACTED_IN]->(m)
      )

      FOREACH (genre IN $genres |
        MERGE (g:Genre {name: genre})
        MERGE (m)-[:HAS_GENRE]->(g)
      )

      FOREACH (theme IN $themes |
        MERGE (t:Theme {name: theme})
        MERGE (m)-[:HAS_THEME]->(t)
      )

      FOREACH (award IN $awards |
        MERGE (aw_type:AwardType {
          name: split(award, " (")[0]
        })

        CREATE (win:AwardWin {
          category: CASE 
            WHEN award CONTAINS "(" 
            THEN replace(split(award, "(")[1], ")", "")
            ELSE null
          END,
          movie: $title
        })

        MERGE (m)-[:WON]->(win)
        MERGE (win)-[:TYPE]->(aw_type)
      )
      `,
      {
        title: movie.title,
        year: movie.year || null,
        director: movie.director,
        actors: movie.actors || [],
        genres: movie.genre || [],
        themes: movie.themes || [],
        awards: (movie.awards || []).filter(a => a !== "None")
      }
    );
  } finally {
    await session.close();
  }
};