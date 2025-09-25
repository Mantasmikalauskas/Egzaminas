
import SiteConfig from '../models/SiteConfig.js';
export const getAbout = async (req,res)=>{
  let item = await SiteConfig.findOne();
  if(!item){ item = await SiteConfig.create({aboutText:'Mūsų įmonė teikia nuomos paslaugas...'}) }
  res.json(item);
};
export const updateAbout = async (req,res)=>{
  let item = await SiteConfig.findOne();
  if(!item){ item = await SiteConfig.create({aboutText:req.body.aboutText||''}) }
  else{ item.aboutText = req.body.aboutText || item.aboutText; await item.save(); }
  res.json(item);
};
