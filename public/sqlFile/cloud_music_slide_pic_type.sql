/*
 Navicat Premium Data Transfer

 Source Server         : cehsi 
 Source Server Type    : MySQL
 Source Server Version : 50553
 Source Host           : localhost:3306
 Source Schema         : cloud_music

 Target Server Type    : MySQL
 Target Server Version : 50553
 File Encoding         : 65001

 Date: 10/01/2020 11:19:15
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for cloud_music_slide_pic_type
-- ----------------------------
DROP TABLE IF EXISTS `cloud_music_slide_pic_type`;
CREATE TABLE `cloud_music_slide_pic_type`  (
  `id` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `typeName` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `typeValue` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `createTime` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '发现下的轮播图类型' ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
