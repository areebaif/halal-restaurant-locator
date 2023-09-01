import { GetStaticProps, InferGetStaticPropsType } from "next";
import { createSwaggerSpec } from "next-swagger-doc";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
const SwaggerUI = dynamic(import("swagger-ui-react"), { ssr: false });

function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <SwaggerUI spec={spec} />; // <== 🔥 SwaggerUI is rendered here
}

export const getStaticProps: GetStaticProps = async () => {
  const spec: Record<string, any> = createSwaggerSpec({
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Swagger API Docs for Halal Restaurant Locator",
        description:
          "This is the api design for halal restaurant locator server based on opneAPI 3.0 specifications.",
        contact: {
          email: "halal.restaurant.locator@gmail.com",
        },
        version: "1.0.11",
      },
    },
  });

  return {
    props: {
      spec,
    },
  };
};

export default ApiDoc;
