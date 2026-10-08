import {useRecords} from "@modula/product-ui";

export function useTemplates() {
  return useRecords({id: "templates", type: "template", searchParam: "q", sortParam: "sort", limit: 100});
}
