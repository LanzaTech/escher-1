const assert = require('chai').assert;
const require_helper = require('./helpers/require_helper');
const pathwayUtils = require_helper('pathwayGraph');

const vanillinMap = require('./data/vanillin.json');
const myoInositol = require('./data/myo-inositol.json');
const DGalaktonate = require('./data/DGalaktonate.json');
const Caffeoyl = require('./data/caffeoyl.json');

describe('pathwayUtils', () => {
  describe('reactionsMetabolites', () => {
    it('should return every metabolite', () => {
      const allMetabolites = pathwayUtils
        .reactionsMetabolites(vanillinMap.model.reactions);

      assert.sameMembers(allMetabolites.sort(), [
        'MNXM1', 'MNXM10', 'MNXM2',
        'MNXM204', 'MNXM238', 'MNXM4',
        'MNXM56', 'MNXM611', 'MNXM754',
        'MNXM8', 'MNXM959', 'MNXM982'
      ]);
    });
  });

  describe('groupReactionsByMetabolite', () => {
    it('should return reactions grouped by metabolite', () => {
      const testMetabolites = [
        'MNXM1',
        'MNXM10',
        'MNXM2',
      ]

      const groupedReactions = pathwayUtils
        .groupReactionsByMetabolite(vanillinMap.model.reactions, testMetabolites);

      const reactionNamesGroupedByMetabolite = Object.entries(groupedReactions)
        .map(([mName, reactions]) => [mName, reactions.map(r => r.name).slice().sort()]);
      assert.sameDeepMembers(reactionNamesGroupedByMetabolite, [
        ['MNXM1', ['rhea:13021', 'rhea:13309']],
        ['MNXM10', ['rhea:13021', 'rhea:13309']],
        ['MNXM2', ['rhea:13021', 'rhea:13309', 'rhea:24848']],
      ]);
    });
  });

  describe('obtainCofactors', () => {
    it('should return the cofactor having more than 2 reactions', () => {
      const reactionsByMetabolite = {
        'MNXM1': ['rhea:13021', 'rhea:13309'],
        'MNXM10': ['rhea:13021', 'rhea:13309'],
        'MNXM2': ['rhea:13021', 'rhea:13309', 'rhea:24848'],
      };

      const cofactors = pathwayUtils.obtainCofactors(reactionsByMetabolite);

      assert.sameMembers(cofactors, ['MNXM2']);
    })
  });

  describe('oppositeMetabolites', () => {
    it('should return the metabolites with the opposite sign', () => {
      const testMetabolites = {
        MNXM4: -1,
        MNXM8: 1,
        MNXM1: -1,
        MNXM204: 1,
        MNXM2: 1,
        MNXM10: -1,
        MNXM982: -1,
        MNXM56: 1
      }

      const opposites = pathwayUtils.oppositeMetabolites(testMetabolites, 'MNXM4');

      assert.sameMembers(opposites.sort(), [
        'MNXM2',
        'MNXM204',
        'MNXM56',
        'MNXM8'
      ]);
    });
  });

  describe('notSecondaryMetabolites', () => {
    it('should return the opposite, that are not cofactos', () => {
      const testMetabolites = {
        MNXM4: -1,
        MNXM8: 1,
        MNXM1: -1,
        MNXM204: 1,
        MNXM2: 1,
        MNXM10: -1,
        MNXM982: -1,
        MNXM56: 1
      }
      const cofactors = new Set(['MNXM204', 'MNXM56']);

      const primaries = pathwayUtils
        .notSecondaryMetabolites(testMetabolites, 'MNXM4', cofactors);

      assert.sameMembers(primaries.sort(), [
        'MNXM2',
        'MNXM8'
      ]);
    });
  });

  describe('sortedReactionsProducts', () => {
    it('should work for vanillin', () => {
      const response = pathwayUtils.sortedReactionsProducts(vanillinMap.model.reactions, 'MNXM754');
      assert.sameMembers(response.reactions, vanillinMap.reactions.map(r => r.id));
      assert.sameMembers(response.primaryNodes, vanillinMap.primary_nodes.map(n => n.id));
    });

    it('should work for myo-inosotol', () => {
      const response = pathwayUtils.sortedReactionsProducts(myoInositol.model.reactions, 'MNXM929');
      assert.sameMembers(response.reactions, myoInositol.reactions.map(r => r.id));
      assert.sameMembers(response.primaryNodes, myoInositol.primary_nodes.map(n => n.id));
    });

    it('should work for D-Galaktonate', () => {
      const response = pathwayUtils.sortedReactionsProducts(DGalaktonate.model.reactions, 'MNXM1734');
      assert.sameMembers(response.reactions, DGalaktonate.reactions.map(r => r.id));
      assert.sameMembers(response.primaryNodes, DGalaktonate.primary_nodes.map(n => n.id));
    });

    it('should work for Caffeoyl', () => {
      const response = pathwayUtils.sortedReactionsProducts(Caffeoyl.model.reactions, 'MNXM443');
      assert.sameMembers(response.reactions, Caffeoyl.reactions.map(r => r.id));
      assert.sameMembers(response.primaryNodes, Caffeoyl.primary_nodes.map(n => n.id));
    });
  });
});
