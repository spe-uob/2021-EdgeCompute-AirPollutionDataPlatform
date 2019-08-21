#!/usr/bin/env Rscript
library(openair)

current_year <- format(Sys.Date(), "%Y")
previous_day <- Sys.Date() - 1

resultStoreFiles<-function(vector_sites){
  for (value in vector_sites){
    print(value)
    meta <- importAURN(site = value, year = current_year, pollutant = "all",hc = FALSE, meta = TRUE, verbose = FALSE)
    if (!is.null(meta)){
      meta_day <- selectByDate(meta, start=previous_day, end=previous_day)
      write.csv(meta_day, file = paste("/home/kevin/import_scripts/defra_aurn_imports/", value, ".csv", sep = "", collapse = ""))
    }
  }
  return("Done")
}

london_sites <- c("a3", "bex", "bren", "bri", "brn", "by2", "by1", "cll2", "crd", "ea8", "hg1", "hg2", "hg4", "hil", "hk4", "hors", "hr3", "hrl", "hs1", "ks1", "lon5", "lon6", "lw1", "my1", "sk1", "sk2", "sk5", "sut1", "sut3", "ted", "ted2", "th2", "wa2", "wl")
result <- resultStoreFiles(london_sites)

bristol_sites <- c("brs8", "br11")
result <- resultStoreFiles(bristol_sites)

# GET DATA FROM BRISTOL ST PAUL'S OF THE PREVIOUS DAY AND WRITE IT AS CSV ON A FILE IN SAME FOLDER
# meta_brs8 <- importAURN(site = "brs8", year = current_year, pollutant = "all",hc = FALSE, meta = TRUE, verbose = FALSE)
# if (!is.null(meta_brs8)){
#   meta_brs8_day <- selectByDate(meta_brs8, start=previous_day, end=previous_day)
#   write.csv(meta_brs8_day, file = "/home/kevin/import_scripts/defra_aurn_imports/brs8.csv")
# }

# GET DATA FROM BRISTOL TEMPLE WAY OF THE PREVIOUS DAY AND WRITE IT AS CSV ON A FILE IN SAME FOLDER
# meta_br11 <- importAURN(site = "br11", year = current_year, pollutant = "all",hc = FALSE, meta = TRUE, verbose = FALSE)
# if (!is.null(meta_br11)){
#   meta_br11_day <- selectByDate(meta_br11, start=previous_day, end=previous_day)
#   write.csv(meta_br11_day, file = "/home/kevin/import_scripts/defra_aurn_imports/br11.csv")
# }
