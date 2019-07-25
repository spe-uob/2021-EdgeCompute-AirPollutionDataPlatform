#!/usr/bin/env Rscript
library(openair)

current_year <- format(Sys.Date(), "%Y")
previous_day <- Sys.Date() - 1

# GET DATA FROM BRISTOL ST PAUL'S OF THE PREVIOUS DAY AND WRITE IT AS CSV ON A FILE IN SAME FOLDER
meta_brs8 <- importAURN(site = "brs8", year = current_year, pollutant = "all",hc = FALSE, meta = TRUE, verbose = FALSE)
if (!is.null(meta_brs8)){
  meta_brs8_day <- selectByDate(meta_brs8, start=previous_day, end=previous_day)
  write.csv(meta_brs8_day, file = "/home/kevin/import_scripts/defra_aurn_imports/brs8.csv")
}

# GET DATA FROM BRISTOL TEMPLE WAY OF THE PREVIOUS DAY AND WRITE IT AS CSV ON A FILE IN SAME FOLDER
meta_br11 <- importAURN(site = "br11", year = current_year, pollutant = "all",hc = FALSE, meta = TRUE, verbose = FALSE)
if (!is.null(meta_br11)){
  meta_br11_day <- selectByDate(meta_br11, start=previous_day, end=previous_day)
  write.csv(meta_br11_day, file = "/home/kevin/import_scripts/defra_aurn_imports/br11.csv")
}
