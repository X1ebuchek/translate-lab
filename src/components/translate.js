import React, { useEffect, useState } from "react";
import axios from "axios";

const doTranslation = async (input, languageCode, cancelToken) => {
  try {
    const { data } = await axios.get(
      `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${process.env.REACT_APP_DICT_KEY}`,
      {
        params: {
          lang: `ru-${languageCode}`,
          text: input
        },
        cancelToken: cancelToken.token
      }
    );

    return data.def
      .reduce((acc, def) => acc.concat(def.tr.map(tr => tr.text)), [])
      .join(", ");
  } catch (err) {
    return "";
  }
};

export default ({ language, text }) => {
  const [translated, setTranslated] = useState("");

  useEffect(() => {
    if (!text) {
      return;
    }

    const cancelToken = axios.CancelToken.source();

    doTranslation(text, language, cancelToken).then(setTranslated);

    return () => {
      try {
        cancelToken.cancel();
      } catch (err) {}
    };
  }, [text, language]);

  return (
    <div>
      <label className="label">Output</label>
      <h1 className="title">{translated}</h1>
    </div>
  );
};
