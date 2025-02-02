#import "@preview/wordometer:0.1.2": word-count, total-words

#set page(
  paper: "a4", 
  numbering: "1",
  number-align: top + right,
  margin: 1.00in,
)

#set text(
  12pt,
  font: "New Computer Modern",
  lang: "en"
)

// for title, don't touch
#set par(leading: 1em)

// title
#align(center + horizon)[
  *Is it likely that the use of transgenic (or gene-edited) malaria-resistant mosquitoes will be an effective method to control malaria?*
  //\ #total-words words
  \
  \ Peti Setabandhu \
  University of British Columbia \
  SCIE 113: First-Year Seminar in Science \
  Professor Edward Grant \
  November 19, 2024
]

#pagebreak()

#set par(
  leading: 1.36em,
  first-line-indent: 0.5in
  )
// #show par: set block(spacing: 2em)
// need to use this in v0.12 now or something??
#set par(spacing: 2em)
#show heading: set block(above: 2em, below: 1em)
#show: word-count // anything below is included in wc

// essay question: Is it likely that the use of transgenic (or gene-edited) malaria-resistant mosquitoes will be an effective method to control malaria

// TENTATIVE: intro
#h(0.5in)
Malaria, although eliminated in many countries today, remains a notable public health concern. In the 2010s, malaria led to over 500,000 deaths and was a leading cause of child mortality. While death tolls have decreased substantially, progress in the last decade has slowed due to the obsolescence of traditional vector control methods like insecticides. 
Due to its mosquito-borne nature, scientists are now exploring genetic engineering approaches to control malaria and replace those traditional methods. 
This essay examines the creation of transgenic #footnote("the artificial introduction of external genes into the genome of an organism") malaria-resistant mosquitoes, the development of self-limiting mutations for population control, and the integration of these approaches with non-transgenic control methods.
Although uncertainties still exist regarding transmission dynamics in wild populations, this essay argues that genetically modified mosquitoes show considerable promise in controlling malaria, particularly when deployed as part of a larger vector management strategy.

// TENTATIVE: Reason 1
One approach, creating transgenic mosquitoes that resist the parasite responsible for malaria, directly interrupts the transmission cycle.
#cite(<pasciniTransgenicAnophelesMosquitoes2022>, form: "prose") show that transgenic mosquitoes can effectively reduce malaria transmission by expressing anti-malarial effector molecules, which inhibit the development of the Plasmodium parasite within the mosquito. By preventing the Plasmodium parasite from being activated within its gut, an infected but modified mosquito cannot infect humans, eliminating it as a malaria vector.
The researchers modified Anopheles mosquitoes to secrete huPAI-1 (human plasminogen activator inhibitor 1), a compound that inhibits specific enzymes (tPA and uPA) that the Plasmodium parasite uses to move through human tissue. The study reported that induced expression of huPAI-1 within the mosquito's midgut and salivary glands resulted in fewer parasitic oocysts forming and decreased infection rates within the test population of mice. 
These results demonstrate that transgenes targeting the parasite's interaction with the host tissue can effectively prevent malaria transmission, supporting the viability of genetic modification for malaria control.

// TENTATIVE: Reason 2
Another promising approach involves self-limiting mutations, which control malaria by targeting mosquitos' reproductive cycle and population.
#cite(<pollegioniDetectingPopulationDynamics2020>, form: "prose") demonstrate that transgenic "sex-ratio distorter" mutations in Anopheles gambiae mosquitoes result in \~95% male offspring, which reduces the population of biting females.
Mosquito offspring can also be targeted agnostic of sex, such as in cases where health officials must control invasive species. #cite(<patilEliminationClosedPopulation2022>, form: "prose") demonstrate that the release of _Oxitec OX5034_ transgenic mosquitoes into a controlled environment of Aedes aegypti or _yellow fever_ mosquitoes led to offspring lethality rates over 95%, causing a rapid decline in their population.
Provided modified mosquitoes are released consistently enough to eliminate populations, both forms of this transgenic technique show promise where invasive species or excessive mosquito populations are significant factors in malaria transmission.

// TENTATIVE: Reason 3
While both paradigms presented thus far show promise individually, their effectiveness can be enhanced when combined with existing non-transgenic control methods. 
For instance, #cite(<khamisOptimalControlMalaria2018>, form: "prose") show that combining transgenic mosquitoes with drug therapies, such as artemisinin-based treatments, can reduce the cost of malaria control and enhance the effectiveness of interventions even in areas with insecticide-resistant mosquito populations. Using an optimal control framework, the authors found that introducing drug treatments can "reduce the critical vector control release ratio necessary to cause disease fadeout," meaning the same reduction in malaria transmission can be achieved with fewer transgenic mosquitoes.
Likewise, #cite(<carvalhoTwoStepMale2014>, form: "prose") hypothesize that with refinement, transgenesis can act as a new class alongside traditional integrated vector management techniques like habitat reduction and insecticide-treated bed nets to further suppresses mosquito populations. 
This research demonstrates that integrating transgenesis as part of a multi-pronged approach increases effectiveness and lowers cost barriers, bolstering the real-world efficacy of transgenic mosquitoes—especially pertinent as malaria is most prevalent today in less economically developed countries.

// TENTATIVE: Counterargument(s)
Thus far, the primary limitation of transgenic mosquito approaches has been the challenge of transmission dynamics—specifically, how effectively beneficial modifications spread and persist in wild populations. Two biological factors create this challenge.
First, wild mosquitoes' genetic makeup results from millions of years of evolution, and as such, genetic modifications often cause a fitness disadvantage, decreasing the likelihood that future offspring will receive that genetic modification. When researchers genetically modified Anopheles coluzzii mosquitoes to become sterile and released them in Burkina Faso, they found that the transgenic mosquitoes had lower survival rates and were less mobile than their wild counterparts @yaoMarkreleaserecaptureExperimentBurkina2022. 
Second, and particularly in the case of transgenic anti-malarial effector mosquitoes, the laws of inheritance dictate that the mosquitoes typically pass their engineered traits to only about 50% of their offspring, causing any modification to be diluted and eventually lost in the wild population over time @gantzHighlyEfficientCas9mediated2015. 
This difficulty in controlling transmission dynamics has remained a prevalent argument against the long-term sustainability of transgenic mosquitoes as a vector control method.

// TENTATIVE: Rebuttal
Recent advancements in genetic engineering and population modelling have provided potential solutions to these problems in light of these issues.
Researchers have developed gene drives, a technique that increases the likelihood of genetically modified organisms passing on a particular genotype (genetic trait) to their offspring. #cite(<gantzHighlyEfficientCas9mediated2015>, form: "prose") apply this to genetically engineered malaria-resistant mosquitoes, demonstrating an increase in the inheritance rate to "\~99.5% of the progeny" in Anopheles stephensi, a primary malaria vector in Asia. This method enables the mutation to permeate the population much faster than natural, ensuring that the genetic modification lasts across generations of mosquitoes.
New transgenic mosquitoes can also undergo more advanced fitness studies and population modelling, which help isolate specific mutations that negligibly impact fitness and plan better vector control strategies @rafikovOptimalControlStrategy2009. Using these techniques, researchers even found transgenes predicted to improve fitness artificially, such as the salivary gland and midgut peptide 1-expressing mosquitoes described by @marrelliTransgenicMalariaresistantMosquitoes2007.
These new understandings enable us to develop transgenic mosquitoes with minimal fitness impacts and most effectively disperse them.

// TENTATIVE: conclusion
Altogether, transgenic mosquitoes—parasite-resistant and self-limiting—represent a promising frontier in malaria control, becoming even more effective when combined with other non-transgenic vector control methods. 
While transmission dynamics initially challenged their effectiveness, advances in gene drive technology and population modelling now provide viable solutions for maintaining mutations in wild populations. 
As traditional methods become less effective due to resistance, new approaches will have to step up to offer a promising path to eradicating malaria—and transgenesis appears a favourable candidate. 
For now, more research into temporary and reversible modifications must be done to balance the goal of controlling malaria with the potential for unintended consequences down the line.

// references
#pagebreak()
#set par(first-line-indent: 0em)
#bibliography(
  "Term Paper.bib", 
  style: "apa",
  title: "References"
)