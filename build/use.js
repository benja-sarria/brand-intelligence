"use strict";
// require("@tensorflow/tfjs");
// const use = require("@tensorflow-models/universal-sentence-encoder");
// // Import @tensorflow/tfjs-core
// const tf = require("@tensorflow/tfjs-core");
// // Adds the CPU backend to the global backend registry.
// require("@tensorflow/tfjs-backend-cpu");
// let similarityMatrix;
// class NlpSentenceEncoderComponent {
//     list_sentences = [];
//     plotly_heatmap = {};
//     input_sentences!: string[];
//     input_threshold!: 0.5;
//     output_resultshtml!: string;
//     analyzing_text!: boolean;
//     ngOnInit() {
//         this.input_sentences = ["coca-cola", "cuca", "sola-cola", "cola-sola"];
//         this.input_threshold = 0.5;
//         this.onClickAnalyzeSentences();
//     }
//     async onClickAnalyzeSentences() {
//         var list_sentences = this.input_sentences;
//         console.log(list_sentences);
//         this.get_similarity(list_sentences);
//     }
//     get_embeddings(list_sentences: any, callback: any) {
//         use.load().then((model: any) => {
//             model.embed(list_sentences).then((embeddings: any) => {
//                 callback(embeddings);
//             });
//         });
//     }
//     dot(a: any, b: any) {
//         var hasOwnProperty = Object.prototype.hasOwnProperty;
//         var sum = 0;
//         for (var key in a) {
//             if (hasOwnProperty.call(a, key) && hasOwnProperty.call(b, key)) {
//                 sum += a[key] * b[key];
//             }
//         }
//         return sum;
//     }
//     similarity(a: any, b: any) {
//         var magnitudeA = Math.sqrt(this.dot(a, a));
//         var magnitudeB = Math.sqrt(this.dot(b, b));
//         if (magnitudeA && magnitudeB)
//             return this.dot(a, b) / (magnitudeA * magnitudeB);
//         else return false;
//     }
//     cosine_similarity_matrix(matrix: any) {
//         let cosine_similarity_matrix = [];
//         for (let i = 0; i < matrix.length; i++) {
//             let row = [];
//             for (let j = 0; j < i; j++) {
//                 row.push(cosine_similarity_matrix[j][i]);
//             }
//             row.push(1);
//             for (let j = i + 1; j < matrix.length; j++) {
//                 row.push(this.similarity(matrix[i], matrix[j]));
//             }
//             cosine_similarity_matrix.push(row);
//         }
//         return cosine_similarity_matrix as any;
//     }
//     form_groups(cosine_similarity_matrix: any) {
//         let dict_keys_in_group: any = {};
//         let groups: any = [];
//         for (let i = 0; i < cosine_similarity_matrix.length; i++) {
//             var this_row = cosine_similarity_matrix[i];
//             for (let j = i; j < this_row.length; j++) {
//                 if (i != j) {
//                     let sim_score: number = cosine_similarity_matrix[i][j];
//                     if (sim_score > this.input_threshold) {
//                         let group_num: number;
//                         if (!(i in dict_keys_in_group)) {
//                             group_num = groups.length;
//                             dict_keys_in_group[i] = group_num;
//                         } else {
//                             group_num = dict_keys_in_group[i];
//                         }
//                         if (!(j in dict_keys_in_group)) {
//                             dict_keys_in_group[j] = group_num;
//                         }
//                         if (groups.length <= group_num) {
//                             groups.push([]);
//                         }
//                         groups[group_num].push(i);
//                         groups[group_num].push(j);
//                     }
//                 }
//             }
//         }
//         let return_groups = [];
//         for (var i in groups) {
//             return_groups.push(Array.from(new Set(groups[i])));
//         }
//         // console.log(return_groups);
//         return return_groups;
//     }
//     async get_similarity(list_sentences: any) {
//         let callback = (embeddings: any) => {
//             // console.log("embeddings", embeddings);
//             let cosine_similarity_matrix = this.cosine_similarity_matrix(
//                 embeddings.arraySync()
//             );
//             console.log(cosine_similarity_matrix);
//             similarityMatrix = cosine_similarity_matrix;
//             let groups: any = this.form_groups(cosine_similarity_matrix);
//             let html_groups = "";
//             for (let i in groups) {
//                 html_groups +=
//                     "<br/><b>Group " + String(parseInt(i) + 1) + "</b><br/>";
//                 for (let j in groups[i]) {
//                     // console.log(groups[i][j], list_sentences[ groups[i][j] ])
//                     html_groups += list_sentences[groups[i][j]] + "<br/>";
//                 }
//             }
//             this.output_resultshtml = html_groups;
//             // plot heatmap
//             let colors = [];
//             let base_color = 54;
//             for (let i = 0; i <= 10; i++) {
//                 colors.push([i / 10, "rgb(0," + (base_color + i * 20) + ",0)"]);
//             }
//             this.plotly_heatmap = {
//                 data: [
//                     {
//                         z: cosine_similarity_matrix, // [[1, 20, 30], [20, 1, 60], [30, 60, 1]],
//                         x: list_sentences,
//                         y: list_sentences,
//                         type: "heatmap",
//                         colorscale: colors,
//                     },
//                 ],
//                 layout: { height: 1200, title: "Similarity", autosize: true },
//             };
//             this.analyzing_text = false;
//             return cosine_similarity_matrix;
//         };
//         this.analyzing_text = true;
//         let embeddings = await this.get_embeddings(
//             list_sentences,
//             callback.bind(this)
//         );
//     }
// }
// const trial = new NlpSentenceEncoderComponent();
// (module.exports = NlpSentenceEncoderComponent), similarityMatrix;
//# sourceMappingURL=use.js.map