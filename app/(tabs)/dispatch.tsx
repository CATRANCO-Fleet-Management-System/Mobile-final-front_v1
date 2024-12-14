import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE  } from "react-native-maps";
import Icon from "react-native-vector-icons/Ionicons";
import Sidebar from "../components/Sidebar";
import DispatchModal from "../components/DispatchModal";
import AlleyModal from "../components/AlleyModal";
import echo from "../../constants/utils/pusherConfig"; 
import BusList from "../components/Buslist";
import Timer from "../components/Timer";
import SwipeToRefresh from "../components/Refresh";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "expo-router";
import { endDispatch } from "@/services/dispatch/dispatchServices";

// Your coordinates data
const routeData = [
  { latitude: 8.475946, longitude: 124.6120194  },
  { latitude: 8.4759359, longitude: 124.612108  },
  { latitude: 8.4759231, longitude: 124.6121932  },
  { latitude: 8.4759068, longitude: 124.612282  },
  { latitude: 8.475883, longitude: 124.6123722  },
  { latitude: 8.475848, longitude: 124.6124568  },
  { latitude: 8.475796, longitude: 124.6125318  },
  { latitude: 8.4757312, longitude: 124.6125955  },
  { latitude: 8.4756501, longitude: 124.6126401  },
  { latitude: 8.4754746, longitude: 124.6126672  },
  { latitude: 8.4753422, longitude: 124.6126636  },
  { latitude: 8.4752531, longitude: 124.6126647  },
  { latitude: 8.4751628, longitude: 124.6126699  },
  { latitude: 8.4750721, longitude: 124.6126792  },
  { latitude: 8.4749831, longitude: 124.612688  },
  { latitude: 8.4748911, longitude: 124.6126975  },
  { latitude: 8.4747976, longitude: 124.6127074  },
  { latitude: 8.4747058, longitude: 124.6127159  },
  { latitude: 8.4746149, longitude: 124.612726  },
  { latitude: 8.4745221, longitude: 124.6127377  },
  { latitude: 8.4744329, longitude: 124.6127547  },
  { latitude: 8.4743506, longitude: 124.6127948  },
  { latitude: 8.4742855, longitude: 124.6128578  },
  { latitude: 8.4742427, longitude: 124.6129408  },
  { latitude: 8.4742149, longitude: 124.6130275  },
  { latitude: 8.4741917, longitude: 124.6131157  },
  { latitude: 8.4741723, longitude: 124.6132052  },
  { latitude: 8.4741557, longitude: 124.613295  },
  { latitude: 8.4741394, longitude: 124.6133849  },
  { latitude: 8.4741233, longitude: 124.613476  },
  { latitude: 8.4741127, longitude: 124.6135663  },
  { latitude: 8.4741089, longitude: 124.6136561  },
  { latitude: 8.474111, longitude: 124.613747  },
  { latitude: 8.4741221, longitude: 124.6138367  },
  { latitude: 8.4741438, longitude: 124.6139248  },
  { latitude: 8.4741668, longitude: 124.6139858  },
  { latitude: 8.4741939, longitude: 124.6140559  },
  { latitude: 8.4742334, longitude: 124.6141398  },
  { latitude: 8.474276, longitude: 124.6142218  },
  { latitude: 8.4743185, longitude: 124.614304  },
  { latitude: 8.4743595, longitude: 124.6143876  },
  { latitude: 8.4743889, longitude: 124.6144743  },
  { latitude: 8.4744007, longitude: 124.6145643  },
  { latitude: 8.4743939, longitude: 124.6146543  },
  { latitude: 8.4743658, longitude: 124.6147425  },
  { latitude: 8.4743167, longitude: 124.6148195  },
  { latitude: 8.4742537, longitude: 124.6148826  },
  { latitude: 8.4741804, longitude: 124.6149354  },
  { latitude: 8.4741003, longitude: 124.6149797  },
  { latitude: 8.4740176, longitude: 124.6150152  },
  { latitude: 8.4739318, longitude: 124.6150461  },
  { latitude: 8.4738462, longitude: 124.6150761  },
  { latitude: 8.4737606, longitude: 124.6151075  },
  { latitude: 8.4736743, longitude: 124.6151394  },
  { latitude: 8.4735892, longitude: 124.6151715  },
  { latitude: 8.4735039, longitude: 124.6152052  },
  { latitude: 8.4734209, longitude: 124.6152425  },
  { latitude: 8.4733412, longitude: 124.6152872  },
  { latitude: 8.473266, longitude: 124.6153383  },
  { latitude: 8.4731934, longitude: 124.6153944  },
  { latitude: 8.4731253, longitude: 124.6154557  },
  { latitude: 8.4730637, longitude: 124.6155208  },
  { latitude: 8.4730048, longitude: 124.6155906  },
  { latitude: 8.4729508, longitude: 124.6156636  },
  { latitude: 8.4729188, longitude: 124.615714  },
  { latitude: 8.4728679, longitude: 124.6157914  },
  { latitude: 8.4728214, longitude: 124.6158723  },
  { latitude: 8.4727766, longitude: 124.615954  },
  { latitude: 8.472731, longitude: 124.6160355  },
  { latitude: 8.4726861, longitude: 124.6161158  },
  { latitude: 8.472641, longitude: 124.6161963  },
  { latitude: 8.4725953, longitude: 124.6162763  },
  { latitude: 8.4725511, longitude: 124.6163586  },
  { latitude: 8.4725089, longitude: 124.6164417  },
  { latitude: 8.4724658, longitude: 124.6165244  },
  { latitude: 8.4724218, longitude: 124.6166065  },
  { latitude: 8.4723768, longitude: 124.6166875  },
  { latitude: 8.4723297, longitude: 124.6167677  },
  { latitude: 8.4722834, longitude: 124.6168475  },
  { latitude: 8.472238, longitude: 124.6169288  },
  { latitude: 8.4721997, longitude: 124.6170013  },
  { latitude: 8.4721897, longitude: 124.6170562  },
  { latitude: 8.4721171, longitude: 124.617163  },
  { latitude: 8.4720765, longitude: 124.6172447  },
  { latitude: 8.4720434, longitude: 124.6173269  },
  { latitude: 8.4720178, longitude: 124.6174099  },
  { latitude: 8.4719974, longitude: 124.6174975  },
  { latitude: 8.4719803, longitude: 124.6175874  },
  { latitude: 8.4719714, longitude: 124.6176778  },
  { latitude: 8.4719727, longitude: 124.6177705  },
  { latitude: 8.4719804, longitude: 124.6178382  },
  { latitude: 8.4719997, longitude: 124.617908  },
  { latitude: 8.4720348, longitude: 124.617993  },
  { latitude: 8.472081, longitude: 124.6180715  },
  { latitude: 8.4721346, longitude: 124.6181459  },
  { latitude: 8.4721917, longitude: 124.6182194  },
  { latitude: 8.4722495, longitude: 124.6182922  },
  { latitude: 8.4723, longitude: 124.6183449  },
  { latitude: 8.4723081, longitude: 124.6183649  },
  { latitude: 8.4723673, longitude: 124.6184378  },
  { latitude: 8.4724814, longitude: 124.6185865  },
  { latitude: 8.4725415, longitude: 124.6186644  },
  { latitude: 8.4725728, longitude: 124.6187063  },
  { latitude: 8.4726449, longitude: 124.6188122  },
  { latitude: 8.4726888, longitude: 124.6188906  },
  { latitude: 8.4727286, longitude: 124.6189737  },
  { latitude: 8.4727648, longitude: 124.6190602  },
  { latitude: 8.4727958, longitude: 124.6191482  },
  { latitude: 8.4728227, longitude: 124.6192373  },
  { latitude: 8.4728457, longitude: 124.6193288  },
  { latitude: 8.4728659, longitude: 124.6194181  },
  { latitude: 8.472886, longitude: 124.6195064  },
  { latitude: 8.4729075, longitude: 124.6195949  },
  { latitude: 8.4729321, longitude: 124.6196833  },
  { latitude: 8.4729618, longitude: 124.6197712  },
  { latitude: 8.4730021, longitude: 124.6198568  },
  { latitude: 8.4730634, longitude: 124.6199248  },
  { latitude: 8.4731386, longitude: 124.6199817  },
  { latitude: 8.473216, longitude: 124.6200211  },
  { latitude: 8.4732571, longitude: 124.6200362  },
  { latitude: 8.4733821, longitude: 124.620067  },
  { latitude: 8.4734704, longitude: 124.6200824  },
  { latitude: 8.47356, longitude: 124.6200958  },
  { latitude: 8.4736495, longitude: 124.620108  },
  { latitude: 8.4737393, longitude: 124.6201206  },
  { latitude: 8.4738303, longitude: 124.6201368  },
  { latitude: 8.473921, longitude: 124.6201568  },
  { latitude: 8.4740127, longitude: 124.6201819  },
  { latitude: 8.4740992, longitude: 124.6202178  },
  { latitude: 8.4741702, longitude: 124.6202666  },
  { latitude: 8.474238, longitude: 124.6203192  },
  { latitude: 8.4743082, longitude: 124.6203743  },
  { latitude: 8.4743799, longitude: 124.6204323  },
  { latitude: 8.474453, longitude: 124.6204934  },
  { latitude: 8.4745231, longitude: 124.6205561  },
  { latitude: 8.4745899, longitude: 124.6206222  },
  { latitude: 8.4746541, longitude: 124.6206912  },
  { latitude: 8.4747161, longitude: 124.6207613  },
  { latitude: 8.4747783, longitude: 124.6208342  },
  { latitude: 8.4748356, longitude: 124.620913  },
  { latitude: 8.4748849, longitude: 124.6209949  },
  { latitude: 8.4749187, longitude: 124.6210779  },
  { latitude: 8.4749401, longitude: 124.6211646  },
  { latitude: 8.474948, longitude: 124.6212508  },
  { latitude: 8.4749448, longitude: 124.6213359  },
  { latitude: 8.4749291, longitude: 124.6214207  },
  { latitude: 8.4749035, longitude: 124.6215031  },
  { latitude: 8.4748708, longitude: 124.6215845  },
  { latitude: 8.4748353, longitude: 124.6216652  },
  { latitude: 8.4747984, longitude: 124.6217468  },
  { latitude: 8.4747597, longitude: 124.621832  },
  { latitude: 8.474721, longitude: 124.6219172  },
  { latitude: 8.4746823, longitude: 124.6220032  },
  { latitude: 8.4746459, longitude: 124.6220899  },
  { latitude: 8.474615, longitude: 124.6221781  },
  { latitude: 8.4745949, longitude: 124.6222702  },
  { latitude: 8.474589, longitude: 124.6223648  },
  { latitude: 8.4746008, longitude: 124.6224578  },
  { latitude: 8.474631, longitude: 124.6225482  },
  { latitude: 8.4746787, longitude: 124.6226363  },
  { latitude: 8.4747285, longitude: 124.622723  },
  { latitude: 8.4747693, longitude: 124.6227988  },
  { latitude: 8.4748276, longitude: 124.622877  },
  { latitude: 8.4748891, longitude: 124.6229537  },
  { latitude: 8.4749431, longitude: 124.6230614  },
  { latitude: 8.4749723, longitude: 124.6231468  },
  { latitude: 8.4749905, longitude: 124.6232343  },
  { latitude: 8.474999, longitude: 124.6233234  },
  { latitude: 8.4749928, longitude: 124.6234575  },
  { latitude: 8.4749761, longitude: 124.6235473  },
  { latitude: 8.4749541, longitude: 124.6236364  },
  { latitude: 8.4749256, longitude: 124.6237243  },
  { latitude: 8.4749087, longitude: 124.6237672  },
  { latitude: 8.4748732, longitude: 124.6238535  },
  { latitude: 8.4748382, longitude: 124.6239394  },
  { latitude: 8.4748045, longitude: 124.6240278  },
  { latitude: 8.4747767, longitude: 124.6241271  },
  { latitude: 8.4747435, longitude: 124.6241937  },
  { latitude: 8.4747343, longitude: 124.6243386  },
  { latitude: 8.4747223, longitude: 124.6244281  },
  { latitude: 8.4747166, longitude: 124.624517  },
  { latitude: 8.4747161, longitude: 124.624562  },
  { latitude: 8.4747193, longitude: 124.6246528  },
  { latitude: 8.4747297, longitude: 124.6247444  },
  { latitude: 8.4747473, longitude: 124.6248352  },
  { latitude: 8.4747711, longitude: 124.6249258  },
  { latitude: 8.4748018, longitude: 124.6250132  },
  { latitude: 8.4748404, longitude: 124.6250981  },
  { latitude: 8.474887, longitude: 124.6251789  },
  { latitude: 8.4749388, longitude: 124.625253  },
  { latitude: 8.4749975, longitude: 124.625323  },
  { latitude: 8.4750596, longitude: 124.6253912  },
  { latitude: 8.4751214, longitude: 124.6254608  },
  { latitude: 8.4751821, longitude: 124.6255364  },
  { latitude: 8.4752495, longitude: 124.6256102  },
  { latitude: 8.475321, longitude: 124.6256712  },
  { latitude: 8.4754133, longitude: 124.6257573  },
  { latitude: 8.4754831, longitude: 124.6258187  },
  { latitude: 8.4755565, longitude: 124.6258749  },
  { latitude: 8.4756339, longitude: 124.6259251  },
  { latitude: 8.4757143, longitude: 124.6259699  },
  { latitude: 8.4757967, longitude: 124.6260127  },
  { latitude: 8.4758805, longitude: 124.6260525  },
  { latitude: 8.4759654, longitude: 124.6260861  },
  { latitude: 8.4760544, longitude: 124.6261116  },
  { latitude: 8.4761433, longitude: 124.6261334  },
  { latitude: 8.4762271, longitude: 124.6261536  },
  { latitude: 8.476316, longitude: 124.6261756  },
  { latitude: 8.4764045, longitude: 124.6261967  },
  { latitude: 8.4764899, longitude: 124.6262169  },
  { latitude: 8.4765802, longitude: 124.6262384  },
  { latitude: 8.4766716, longitude: 124.6262591  },
  { latitude: 8.4767625, longitude: 124.6262801  },
  { latitude: 8.4768518, longitude: 124.626301  },
  { latitude: 8.4769396, longitude: 124.6263226  },
  { latitude: 8.477027, longitude: 124.6263434  },
  { latitude: 8.4771145, longitude: 124.6263631  },
  { latitude: 8.4771999, longitude: 124.6263828  },
  { latitude: 8.4772891, longitude: 124.6264044  },
  { latitude: 8.4773803, longitude: 124.6264272  },
  { latitude: 8.4774744, longitude: 124.6264517  },
  { latitude: 8.4775698, longitude: 124.6264826  },
  { latitude: 8.4776145, longitude: 124.626511  },
  { latitude: 8.4776624, longitude: 124.6265419  },
  { latitude: 8.4777512, longitude: 124.6265798  },
  { latitude: 8.4778331, longitude: 124.6266169  },
  { latitude: 8.477915, longitude: 124.6266539  },
  { latitude: 8.4780002, longitude: 124.626694  },
  { latitude: 8.4780831, longitude: 124.6267391  },
  { latitude: 8.4781629, longitude: 124.6267904  },
  { latitude: 8.4782381, longitude: 124.6268417  },
  { latitude: 8.4783101, longitude: 124.6268936  },
  { latitude: 8.4783816, longitude: 124.6269475  },
  { latitude: 8.4784544, longitude: 124.6270046  },
  { latitude: 8.4785187, longitude: 124.6270622  },
  { latitude: 8.4785747, longitude: 124.6271329  },
  { latitude: 8.4786232, longitude: 124.6272148  },
  { latitude: 8.4786563, longitude: 124.6272981  },
  { latitude: 8.4786746, longitude: 124.6273844  },
  { latitude: 8.4786794, longitude: 124.6274716  },
  { latitude: 8.4786671, longitude: 124.6275646  },
  { latitude: 8.4786376, longitude: 124.6276532  },
  { latitude: 8.478568, longitude: 124.627766  },
  { latitude: 8.4785016, longitude: 124.6278388  },
  { latitude: 8.4784327, longitude: 124.6278903  },
  { latitude: 8.4783559, longitude: 124.6279366  },
  { latitude: 8.4782719, longitude: 124.6279912  },
  { latitude: 8.4781927, longitude: 124.6280445  },
  { latitude: 8.4781144, longitude: 124.628097  },
  { latitude: 8.4780377, longitude: 124.6281482  },
  { latitude: 8.4779618, longitude: 124.6281991  },
  { latitude: 8.4778843, longitude: 124.6282499  },
  { latitude: 8.4778059, longitude: 124.6282993  },
  { latitude: 8.4777273, longitude: 124.6283486  },
  { latitude: 8.4776482, longitude: 124.6283953  },
  { latitude: 8.4775691, longitude: 124.6284406  },
  { latitude: 8.4774905, longitude: 124.6284844  },
  { latitude: 8.4774126, longitude: 124.6285291  },
  { latitude: 8.4773333, longitude: 124.6285765  },
  { latitude: 8.4772552, longitude: 124.6286241  },
  { latitude: 8.4771768, longitude: 124.628672  },
  { latitude: 8.4770994, longitude: 124.6287201  },
  { latitude: 8.477021, longitude: 124.6287685  },
  { latitude: 8.4769418, longitude: 124.6288189  },
  { latitude: 8.4768647, longitude: 124.6288722  },
  { latitude: 8.4767906, longitude: 124.6289273  },
  { latitude: 8.4767187, longitude: 124.6289831  },
  { latitude: 8.476651, longitude: 124.629038  },
  { latitude: 8.4765842, longitude: 124.6290984  },
  { latitude: 8.4765194, longitude: 124.6291589  },
  { latitude: 8.4764508, longitude: 124.629223  },
  { latitude: 8.476382, longitude: 124.6292892  },
  { latitude: 8.4763218, longitude: 124.6293563  },
  { latitude: 8.4760787, longitude: 124.6296274  },
  { latitude: 8.476024, longitude: 124.6297044  },
  { latitude: 8.4759199, longitude: 124.6298595  },
  { latitude: 8.4758699, longitude: 124.6299364  },
  { latitude: 8.4758201, longitude: 124.6300153  },
  { latitude: 8.475771, longitude: 124.6300937  },
  { latitude: 8.4757202, longitude: 124.6301716  },
  { latitude: 8.4756714, longitude: 124.6302467  },
  { latitude: 8.4756231, longitude: 124.630322  },
  { latitude: 8.4755732, longitude: 124.6304006  },
  { latitude: 8.4755469, longitude: 124.6304436  },
  { latitude: 8.4754985, longitude: 124.6305197  },
  { latitude: 8.4754508, longitude: 124.6305963  },
  { latitude: 8.4754025, longitude: 124.6306733  },
  { latitude: 8.4753541, longitude: 124.6307506  },
  { latitude: 8.4753056, longitude: 124.6308285  },
  { latitude: 8.4752556, longitude: 124.6309057  },
  { latitude: 8.4752263, longitude: 124.6309553  },
  { latitude: 8.4751874, longitude: 124.6310107  },
  { latitude: 8.4751398, longitude: 124.6310876  },
  { latitude: 8.4750879, longitude: 124.631171  },
  { latitude: 8.475016, longitude: 124.6312922  },
  { latitude: 8.4749709, longitude: 124.6313751  },
  { latitude: 8.4749166, longitude: 124.6314554  },
  { latitude: 8.474861, longitude: 124.6315339  },
  { latitude: 8.4748085, longitude: 124.6316128  },
  { latitude: 8.4747575, longitude: 124.6316915  },
  { latitude: 8.4747078, longitude: 124.6317696  },
  { latitude: 8.4746586, longitude: 124.631848  },
  { latitude: 8.4746092, longitude: 124.6319257  },
  { latitude: 8.4745592, longitude: 124.6320034  },
  { latitude: 8.4745092, longitude: 124.6320815  },
  { latitude: 8.4744595, longitude: 124.6321599  },
  { latitude: 8.4744101, longitude: 124.6322384  },
  { latitude: 8.4743607, longitude: 124.6323171  },
  { latitude: 8.4743114, longitude: 124.6323948  },
  { latitude: 8.4742622, longitude: 124.632473  },
  { latitude: 8.4742133, longitude: 124.6325512  },
  { latitude: 8.4741652, longitude: 124.6326284  },
  { latitude: 8.4741146, longitude: 124.6327067  },
  { latitude: 8.4740636, longitude: 124.632784  },
  { latitude: 8.4740129, longitude: 124.6328609  },
  { latitude: 8.4739637, longitude: 124.6329382  },
  { latitude: 8.4739153, longitude: 124.6330153  },
  { latitude: 8.4738648, longitude: 124.6330916  },
  { latitude: 8.4738147, longitude: 124.6331654  },
  { latitude: 8.4737672, longitude: 124.6332396  },
  { latitude: 8.4737215, longitude: 124.633312  },
  { latitude: 8.4736752, longitude: 124.6333864  },
  { latitude: 8.4736257, longitude: 124.6334619  },
  { latitude: 8.4735711, longitude: 124.6335408  },
  { latitude: 8.4735154, longitude: 124.6336227  },
  { latitude: 8.4734643, longitude: 124.6336991  },
  { latitude: 8.4734153, longitude: 124.6337755  },
  { latitude: 8.4733668, longitude: 124.6338529  },
  { latitude: 8.4733218, longitude: 124.6339332  },
  { latitude: 8.4732807, longitude: 124.6340138  },
  { latitude: 8.4732423, longitude: 124.6340954  },
  { latitude: 8.4732103, longitude: 124.6341773  },
  { latitude: 8.4731794, longitude: 124.6343004  },
  { latitude: 8.4731608, longitude: 124.6343952  },
  { latitude: 8.4731421, longitude: 124.6344869  },
  { latitude: 8.473124, longitude: 124.6345811  },
  { latitude: 8.4731118, longitude: 124.6346722  },
  { latitude: 8.4731005, longitude: 124.6347645  },
  { latitude: 8.4730899, longitude: 124.6348529  },
  { latitude: 8.4730767, longitude: 124.6349361  },
  { latitude: 8.4731087, longitude: 124.6350483  },
  { latitude: 8.4730965, longitude: 124.6351431  },
  { latitude: 8.4730724, longitude: 124.635334  },
  { latitude: 8.4730082, longitude: 124.6354859  },
  { latitude: 8.4729953, longitude: 124.6355985  },
  { latitude: 8.4729681, longitude: 124.6356904  },
  { latitude: 8.4729751, longitude: 124.6357863  },
  { latitude: 8.4729792, longitude: 124.6358798  },
  { latitude: 8.4729834, longitude: 124.6359724  },
  { latitude: 8.4729862, longitude: 124.6360631  },
  { latitude: 8.4729872, longitude: 124.636152  },
  { latitude: 8.4729859, longitude: 124.6362424  },
  { latitude: 8.4729819, longitude: 124.6363385  },
  { latitude: 8.4729774, longitude: 124.6364288  },
  { latitude: 8.4729694, longitude: 124.6365427  },
  { latitude: 8.4729617, longitude: 124.6366359  },
  { latitude: 8.4729556, longitude: 124.6367265  },
  { latitude: 8.4729483, longitude: 124.636824  },
  { latitude: 8.4729407, longitude: 124.6369151  },
  { latitude: 8.4729319, longitude: 124.6370507  },
  { latitude: 8.4729217, longitude: 124.6372335  },
  { latitude: 8.4729155, longitude: 124.6373254  },
  { latitude: 8.4729093, longitude: 124.6374188  },
  { latitude: 8.472903, longitude: 124.6375105  },
  { latitude: 8.472892, longitude: 124.6376035  },
  { latitude: 8.4729558, longitude: 124.6376395  },
  { latitude: 8.4730078, longitude: 124.6376753  },
  { latitude: 8.4730615, longitude: 124.6377493  },
  { latitude: 8.4731348, longitude: 124.6377939  },
  { latitude: 8.473219, longitude: 124.6378156  },
  { latitude: 8.4733103, longitude: 124.6378267  },
  { latitude: 8.4734019, longitude: 124.6378329  },
  { latitude: 8.4734948, longitude: 124.6378361  },
  { latitude: 8.4735891, longitude: 124.6378335  },
  { latitude: 8.4736793, longitude: 124.6378272  },
  { latitude: 8.4737654, longitude: 124.6378258  },
  { latitude: 8.4738093, longitude: 124.6378259  },
  { latitude: 8.4738993, longitude: 124.6378264  },
  { latitude: 8.4739926, longitude: 124.6378271  },
  { latitude: 8.4740851, longitude: 124.6378291  },
  { latitude: 8.474178, longitude: 124.6378312  },
  { latitude: 8.4742383, longitude: 124.6378632  },
  { latitude: 8.4742744, longitude: 124.6378939  },
  { latitude: 8.4743187, longitude: 124.6378315  },
  { latitude: 8.4744116, longitude: 124.6378306  },
  { latitude: 8.4745047, longitude: 124.6378297  },
  { latitude: 8.4745976, longitude: 124.637829  },
  { latitude: 8.4746904, longitude: 124.6378297  },
  { latitude: 8.4747835, longitude: 124.6378305  },
  { latitude: 8.4748774, longitude: 124.6378308  },
  { latitude: 8.47497, longitude: 124.6378303  },
  { latitude: 8.4750585, longitude: 124.6378289  },
  { latitude: 8.4751451, longitude: 124.6378276  },
  { latitude: 8.4752346, longitude: 124.6378268  },
  { latitude: 8.4753262, longitude: 124.6378265  },
  { latitude: 8.4754179, longitude: 124.6378267  },
  { latitude: 8.4755093, longitude: 124.6378271  },
  { latitude: 8.4756013, longitude: 124.637827  },
  { latitude: 8.4756943, longitude: 124.6378254  },
  { latitude: 8.4757879, longitude: 124.6378229  },
  { latitude: 8.4758811, longitude: 124.6378204  },
  { latitude: 8.4759268, longitude: 124.6378189  },
  { latitude: 8.4760181, longitude: 124.6378163  },
  { latitude: 8.4761092, longitude: 124.6378126  },
  { latitude: 8.476201, longitude: 124.6378081  },
  { latitude: 8.4762948, longitude: 124.6378036  },
  { latitude: 8.4763912, longitude: 124.6377993  },
  { latitude: 8.4764873, longitude: 124.6377964  },
  { latitude: 8.4765689, longitude: 124.6378969  },
  { latitude: 8.4765606, longitude: 124.6379836  },
  { latitude: 8.4765502, longitude: 124.6380725  },
  { latitude: 8.4765397, longitude: 124.6381625  },
  { latitude: 8.4765297, longitude: 124.6382544  },
  { latitude: 8.476517, longitude: 124.6383494  },
  { latitude: 8.4765045, longitude: 124.638445  },
  { latitude: 8.4764923, longitude: 124.6385365  },
  { latitude: 8.4764812, longitude: 124.6386262  },
  { latitude: 8.4764705, longitude: 124.6387123  },
  { latitude: 8.4764572, longitude: 124.6388024  },
  { latitude: 8.4764409, longitude: 124.6388945  },
  { latitude: 8.4764261, longitude: 124.6389914  },
  { latitude: 8.4764156, longitude: 124.6390857  },
  { latitude: 8.476405, longitude: 124.6391772  },
  { latitude: 8.476393, longitude: 124.6392725  },
  { latitude: 8.4763812, longitude: 124.639365  },
  { latitude: 8.4763682, longitude: 124.6394595  },
  { latitude: 8.4763546, longitude: 124.6395523  },
  { latitude: 8.4763419, longitude: 124.6396434  },
  { latitude: 8.4763292, longitude: 124.6397364  },
  { latitude: 8.4763154, longitude: 124.6398292  },
  { latitude: 8.4763017, longitude: 124.6399205  },
  { latitude: 8.4762885, longitude: 124.6400129  },
  { latitude: 8.4762762, longitude: 124.6401048  },
  { latitude: 8.4762632, longitude: 124.6401955  },
  { latitude: 8.4762501, longitude: 124.6402858  },
  { latitude: 8.476238, longitude: 124.6403776  },
  { latitude: 8.4762256, longitude: 124.6404683  },
  { latitude: 8.4762133, longitude: 124.6405579  },
  { latitude: 8.4762007, longitude: 124.6406463  },
  { latitude: 8.4761881, longitude: 124.6407347  },
  { latitude: 8.4761755, longitude: 124.6408241  },
  { latitude: 8.4761618, longitude: 124.6409164  },
  { latitude: 8.4761474, longitude: 124.6410071  },
  { latitude: 8.4761326, longitude: 124.6410982  },
  { latitude: 8.4761186, longitude: 124.6411881  },
  { latitude: 8.4761032, longitude: 124.641278  },
  { latitude: 8.4760872, longitude: 124.6413707  },
  { latitude: 8.4760711, longitude: 124.6414647  },
  { latitude: 8.4760544, longitude: 124.6415584  },
  { latitude: 8.476039, longitude: 124.6416478  },
  { latitude: 8.4760248, longitude: 124.6417363  },
  { latitude: 8.4760321, longitude: 124.6417867  },
  { latitude: 8.4760013, longitude: 124.6418692  },
  { latitude: 8.4759871, longitude: 124.6419583  },
  { latitude: 8.4759736, longitude: 124.6420473  },
  { latitude: 8.4759604, longitude: 124.6421384  },
  { latitude: 8.4759479, longitude: 124.6422295  },
  { latitude: 8.4759377, longitude: 124.6423209  },
  { latitude: 8.4759297, longitude: 124.6424141  },
  { latitude: 8.4759219, longitude: 124.642506  },
  { latitude: 8.4759131, longitude: 124.6425981  },
  { latitude: 8.4759083, longitude: 124.642644  },
  { latitude: 8.4758941, longitude: 124.6427621  },
  { latitude: 8.4758837, longitude: 124.6428475  },
  { latitude: 8.4758686, longitude: 124.6429538  },
  { latitude: 8.4758555, longitude: 124.6430482  },
  { latitude: 8.4758414, longitude: 124.6431442  },
  { latitude: 8.4758348, longitude: 124.6431913  },
  { latitude: 8.4758214, longitude: 124.6432845  },
  { latitude: 8.475808, longitude: 124.643376  },
  { latitude: 8.4757934, longitude: 124.6434674  },
  { latitude: 8.4757796, longitude: 124.6435586  },
  { latitude: 8.4757663, longitude: 124.6436494  },
  { latitude: 8.4757529, longitude: 124.6437379  },
  { latitude: 8.4757357, longitude: 124.6438473  },
  { latitude: 8.4757354, longitude: 124.6439527  },
  { latitude: 8.4757325, longitude: 124.6440041  },
  { latitude: 8.4757226, longitude: 124.6440998  },
  { latitude: 8.4757109, longitude: 124.6441902  },
  { latitude: 8.4756944, longitude: 124.644279  },
  { latitude: 8.475681, longitude: 124.6443713  },
  { latitude: 8.4756667, longitude: 124.6444635  },
  { latitude: 8.4756553, longitude: 124.6445541  },
  { latitude: 8.4756427, longitude: 124.6446404  },
  { latitude: 8.4756242, longitude: 124.6447697  },
  { latitude: 8.4755996, longitude: 124.644749  },
  { latitude: 8.4755094, longitude: 124.6447588  },
  { latitude: 8.4754201, longitude: 124.6447395  },
  { latitude: 8.4753296, longitude: 124.6447246  },
  { latitude: 8.4752954, longitude: 124.6447056  },
  { latitude: 8.4751929, longitude: 124.6447022  },
  { latitude: 8.4751044, longitude: 124.6446859  },
  { latitude: 8.4750152, longitude: 124.6446731  },
  { latitude: 8.4749277, longitude: 124.644666  },
  { latitude: 8.4748524, longitude: 124.644615  },
  { latitude: 8.474765, longitude: 124.6446147  },
  { latitude: 8.4747649, longitude: 124.6446607  },
  { latitude: 8.4748015, longitude: 124.64476  },
  { latitude: 8.4747976, longitude: 124.6448667  },
  { latitude: 8.4747944, longitude: 124.6449486  },
  { latitude: 8.4747906, longitude: 124.6450555  },
  { latitude: 8.4747859, longitude: 124.6451504  },
  { latitude: 8.4747836, longitude: 124.6452397  },
  { latitude: 8.4747814, longitude: 124.6453349  },
  { latitude: 8.4747943, longitude: 124.6454607  },
  { latitude: 8.4748332, longitude: 124.6454905  },
  { latitude: 8.4749245, longitude: 124.6455118  },
  { latitude: 8.4750129, longitude: 124.6455287  },
  { latitude: 8.475102, longitude: 124.645543  },
  { latitude: 8.4751957, longitude: 124.6455635  },
  { latitude: 8.4752887, longitude: 124.645585  },
  { latitude: 8.4753786, longitude: 124.645607  },
  { latitude: 8.4754673, longitude: 124.6456282  },
  { latitude: 8.4755582, longitude: 124.6456494  },
  { latitude: 8.4756448, longitude: 124.6456789  },
  { latitude: 8.4757301, longitude: 124.6457168  },
  { latitude: 8.4757461, longitude: 124.6457625  },
  { latitude: 8.4757231, longitude: 124.6458607  },
  { latitude: 8.4756972, longitude: 124.6459516  },
  { latitude: 8.4756719, longitude: 124.6460401  },
  { latitude: 8.4756477, longitude: 124.6461277  },
  { latitude: 8.4756243, longitude: 124.6462155  },
  { latitude: 8.4756022, longitude: 124.6463034  },
  { latitude: 8.4755803, longitude: 124.6463927  },
  { latitude: 8.4755588, longitude: 124.6464855  },
  { latitude: 8.4755391, longitude: 124.6465738  },
  { latitude: 8.4755201, longitude: 124.6466587  },
  { latitude: 8.4755039, longitude: 124.6467489  },
  { latitude: 8.4754915, longitude: 124.646843  },
  { latitude: 8.4754826, longitude: 124.6469375  },
  { latitude: 8.4754813, longitude: 124.6469996  },
  { latitude: 8.4754737, longitude: 124.6470775  },
  { latitude: 8.4754682, longitude: 124.6471688  },
  { latitude: 8.4754629, longitude: 124.6472601  },
  { latitude: 8.4754588, longitude: 124.6473538  },
  { latitude: 8.475455, longitude: 124.6474441  },
  { latitude: 8.4754528, longitude: 124.6475374  },
  { latitude: 8.4754515, longitude: 124.6476294  },
  { latitude: 8.4754513, longitude: 124.6477226  },
  { latitude: 8.475452, longitude: 124.6478147  },
  { latitude: 8.4754547, longitude: 124.6479067  },
  { latitude: 8.4754583, longitude: 124.6479986  },
  { latitude: 8.4754618, longitude: 124.6480903  },
  { latitude: 8.4754647, longitude: 124.6481816  },
  { latitude: 8.4754691, longitude: 124.6483002  },
  { latitude: 8.4754756, longitude: 124.6483931  },
  { latitude: 8.4754874, longitude: 124.6484898  },
  { latitude: 8.4754897, longitude: 124.6485353  },
  { latitude: 8.4754941, longitude: 124.6486253  },
  { latitude: 8.4754976, longitude: 124.6487235  },
  { latitude: 8.4754998, longitude: 124.6488194  },
  { latitude: 8.475504, longitude: 124.6489118  },
  { latitude: 8.4755095, longitude: 124.6490045  },
  { latitude: 8.4755153, longitude: 124.6490957  },
  { latitude: 8.475521, longitude: 124.6491866  },
  { latitude: 8.4755281, longitude: 124.6492783  },
  { latitude: 8.4755404, longitude: 124.6493621  },
  { latitude: 8.4755395, longitude: 124.6494108  },
  { latitude: 8.4755739, longitude: 124.6494997  },
  { latitude: 8.4756008, longitude: 124.6495459  },
  { latitude: 8.4755867, longitude: 124.6496385  },
  { latitude: 8.4755825, longitude: 124.6497299  },
  { latitude: 8.4755754, longitude: 124.6498249  },
  { latitude: 8.475565, longitude: 124.6499231  },
  { latitude: 8.4755559, longitude: 124.6500217  },
  { latitude: 8.4756672, longitude: 124.6500436  },
  { latitude: 8.4757625, longitude: 124.6500509  },
  { latitude: 8.475853, longitude: 124.6500493  },
  { latitude: 8.4759459, longitude: 124.6500504  },
  { latitude: 8.4760376, longitude: 124.6500493  },
  { latitude: 8.4761291, longitude: 124.650049  },
  { latitude: 8.4762237, longitude: 124.6500515  },
  { latitude: 8.4763179, longitude: 124.6500564  },
  { latitude: 8.4764104, longitude: 124.6500596  },
  { latitude: 8.476501, longitude: 124.6500609  },
  { latitude: 8.4765913, longitude: 124.650059  },
  { latitude: 8.4766793, longitude: 124.6500551  },
  { latitude: 8.4767979, longitude: 124.6500563  },
  { latitude: 8.4768906, longitude: 124.6500426  },
  { latitude: 8.4769867, longitude: 124.650045  },
  { latitude: 8.4770709, longitude: 124.650065  },
  { latitude: 8.4771227, longitude: 124.6500618  },
  { latitude: 8.4771409, longitude: 124.6501796  },
  { latitude: 8.4771207, longitude: 124.6502737  },
  { latitude: 8.4770961, longitude: 124.6503623  },
  { latitude: 8.4770754, longitude: 124.6504541  },
  { latitude: 8.4770505, longitude: 124.6505416  },
  { latitude: 8.4770272, longitude: 124.6506253  },
  { latitude: 8.476976, longitude: 124.650705  },
  { latitude: 8.4769048, longitude: 124.6507785  },
  { latitude: 8.4768107, longitude: 124.6507803  },
  { latitude: 8.4767167, longitude: 124.6507785  },
  { latitude: 8.4766241, longitude: 124.6507702  },
  { latitude: 8.476533, longitude: 124.6507595  },
  { latitude: 8.476443, longitude: 124.650751  },
  { latitude: 8.4763504, longitude: 124.650743  },
  { latitude: 8.4762539, longitude: 124.6507338  },
  { latitude: 8.4761608, longitude: 124.6507218  },
  { latitude: 8.4760674, longitude: 124.6507123  },
  ];


const App = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [dispatchModalVisible, setDispatchModalVisible] = useState(false);
  const [alleyModalVisible, setAlleyModalVisible] = useState(false);
  const [selectedBus, setSelectedBus] = useState<{ vehicle_id: string; status: string } | null>(null);
  const [isHidden, setIsHidden] = useState(false); // To toggle visibility of components
  const [trackerData, setTrackerData] = useState<any>(null);
  const [path, setPath] = useState<{ latitude: number; longitude: number }[]>([]);
  const [renderMap, setRenderMap] = useState(false);
  const [busIcon, setBusIcon] = useState(require("../../assets/images/bus_idle.png"));
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [mapKey, setMapKey] = useState(0);
  const timerRef = useRef(null);
  const busListRef = useRef(null);
  const [markerPosition, setMarkerPosition] = useState(routeData[0]); // Start at the first point
  const [polylineCoordinates, setPolylineCoordinates] = useState([routeData[0]]); // Start the polyline with the first point
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current point index for the simulated marker
  const [isMoving, setIsMoving] = useState(false); // Control the movement of the simulated marker
  const [markerIcon, setMarkerIcon] = useState(require('../../assets/images/bus_on_alley.png'));

  useEffect(() => {
    // Animate the simulated marker along the polyline
    if (isMoving && currentIndex < routeData.length - 1) {
      const intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex + 1 < routeData.length) {
            setMarkerPosition(routeData[prevIndex + 1]);
            setPolylineCoordinates((prevCoordinates) => [
              ...prevCoordinates,
              routeData[prevIndex + 1],
            ]);
            return prevIndex + 1;
          } else {
            clearInterval(intervalId); // Stop when we reach the last point
            return prevIndex;
          }
        });
      }, 1000); // Adjust the interval for speed of movement

      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [isMoving,currentIndex]);

  const handleMarkerPress = () => {
    if (!isMoving) {
      setIsMoving(true); // Start moving the marker
      setMarkerIcon(require('../../assets/images/bus_on_road.png')); // Change the icon to "moving" marker when pressed
    }
  };

  // Static locations with custom marker designs
  const locations = [
    {
      id: 1,
      title: "Canitoan",
      coordinate: { latitude: 8.4663228, longitude: 124.5853069 },
      icon: require("../../assets/images/canitoan.png"), // Replace with your custom icon
    },
    {
      id: 2,
      title: "Silver Creek",
      coordinate: { latitude: 8.475946, longitude: 124.6120194 },
      icon: require("../../assets/images/silver_creek.png"), // Replace with your custom icon
    },
    {
      id: 3,
      title: "Cogon",
      coordinate: { latitude: 8.4759094, longitude: 124.6514315 },
      icon: require("../../assets/images/cogon.png"), // Replace with your custom icon
    },
  ];

  // Load data from AsyncStorage when the component mounts or the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const loadTrackerData = async () => {
        try {
          const savedData = await AsyncStorage.getItem("trackerData");
          if (savedData) {
            setTrackerData(JSON.parse(savedData)); // Set state with saved data
          }
        } catch (error) {
          console.error("Error loading data from AsyncStorage", error);
        }
      };
      
      loadTrackerData(); // Load data when screen is focused

      return () => {
        // Optional cleanup if necessary when screen is unfocused
      };
    }, [])
  );

  // Set up listener when the component mounts
  useEffect(() => {
    // Function to setup real-time listener
    const setupRealTimeListener = () => {
      const channel = echo.channel("flespi-data");

      // Handle incoming event data
      const handleEvent = async (event: any) => {
        console.log("Real-time Data Received:", event);

          // Check if event.data exists and is an object
          if (event && event.location) {
            const { tracker_ident, vehicle_id, location, timestamp, dispatch_log } = event;

            // Check if location data is available and valid
            if (location && location.latitude && location.longitude) {
              // Update path with new coordinates
              setPath((prevPath) => [
                ...prevPath,
                {
                  latitude: location.latitude,
                  longitude: location.longitude,
                },
              ]);

              // Update trackerData with the latest data
              setTrackerData({
                tracker_ident,
                vehicle_id,
                location,
                timestamp,
                dispatch_log,
              });

              // Save the tracker data to AsyncStorage
              try {
                await AsyncStorage.setItem(
                  "trackerData",
                  JSON.stringify({
                    tracker_ident,
                    vehicle_id,
                    location,
                    timestamp,
                    dispatch_log,
                  })
                );
              } catch (error) {
                console.error("Error saving data to AsyncStorage", error);
              }

              // Check if the real-time data matches any predefined location
              const matchedLocation = locations.find(
                (loc) =>
                  Math.abs(loc.coordinate.latitude - location.latitude) < 0.0001 &&
                  Math.abs(loc.coordinate.longitude - location.longitude) < 0.0001
              );

              if (matchedLocation && dispatch_log?.dispatch_logs_id) {
                // Trigger endDispatch when the real-time location matches any static location
                endDispatch(dispatch_log.dispatch_logs_id)
                  .then(() => {
                    console.log("Dispatch ended successfully");
                    // Reset path after dispatch ends
                    setPath([]); // Clear the path
                  })
                  .catch((error) => console.error("Error ending dispatch", error));
              }

              // Update bus icon based on dispatch_log status
              if (dispatch_log) {
                if (dispatch_log.status === 'on road') {
                  setBusIcon(require("../../assets/images/bus_on_road.png"));
                } else if (dispatch_log.status === 'on alley') {
                  setBusIcon(require("../../assets/images/bus_on_alley.png"));
                }
              } else {
                // If dispatch_log is null, set bus to idle
                setBusIcon(require("../../assets/images/bus_idle.png"));
              }
            } else {
              // Clear tracker data if no valid location is available
              setTrackerData(null);
            }
          } else {
            // Handle the case where event.data is empty or undefined
            console.warn("Invalid or empty data received:", event);
            setTrackerData(null);
          }
        };

        // Listen for the "FlespiDataReceived" event and handle incoming data
        channel.listen("FlespiDataReceived", handleEvent);

        // Return cleanup function to stop the listener and disconnect
        return () => {
          console.log("Cleaning up listener...");
          channel.stopListening("FlespiDataReceived");
          echo.disconnect();
        };
      };

      console.log('tracker data', trackerData);
      
      const cleanupListener = setupRealTimeListener();
      
      return cleanupListener; // Cleanup listener on component unmount

  }, []); // Empty dependency array means this effect runs only once

  // Adjust map to include all markers
  useEffect(() => {
    if (mapRef.current) {
      const allCoordinates = [
        ...locations.map((location) => location.coordinate),
        ...(trackerData?.PositionLatitude && trackerData?.PositionLongitude
          ? [{ latitude: trackerData.PositionLatitude, longitude: trackerData.PositionLongitude }]
          : []),
      ];
      mapRef.current.fitToCoordinates(allCoordinates, {
        edgePadding: { top: 10, right: 10, bottom: 10, left: 10 },
        animated: true,
      });
    }
  }, []);

  const refreshTimeout = () => {
    const timeout = setTimeout(() => setRenderMap(true), 10000); // Adjust delay as needed
    return () => clearTimeout(timeout); // Cleanup the timeout on component unmount
  };

  // Delay rendering the map by 10 seconds
  useEffect(() => {
    refreshTimeout();
  }, []);

  useEffect(() => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    setCurrentDate(formattedDate);
  }, []);

  const toggleVisibility = () => {
    setIsHidden((prev) => !prev); // Toggle visibility of busPage, timerContainer, and bottomButtons
  };

  const handleAlleyConfirm = () => {
    console.log("Alley has confirmed");
    setSelectedBus(null);
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (timerRef.current) {
          timerRef.current.saveTimerState(); // Save the timer state when screen loses focus
        }
      };
    }, [])
  );

  const handleDispatchConfirm = () => {
    setSelectedBus(null);
    if (timerRef.current) {
      timerRef.current.startTimer(); // Start the timer
    }
    console.log("Timer started after dispatch confirm");
  };

  const handleRefresh = () => {
    if (busListRef.current) {
      busListRef.current.refreshData();
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setRenderMap(false);
    if (busListRef.current) {
      busListRef.current.refreshData();
    }
    setTimeout(() => {
      setRenderMap(true);
      setPath([]); // Clear the path if necessary
      setRefreshing(false);
    }, 5000); // Hide the map for 5 seconds

    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {/* Map with Real-Time Marker and Polyline */}
      {renderMap ? (
          <MapView
          key={mapKey}
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: trackerData?.location?.latitude || 0,
            longitude: trackerData?.location?.longitude || 0,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          onLayout={() => {
            // Only animate to the marker when the map has been laid out
            if (trackerData?.location) {
              mapRef.current?.animateToRegion({
                latitude: trackerData.location.latitude,
                longitude: trackerData.location.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              });
            }
          }}
        >
          {/* Polyline for the bus route */}
          <Polyline
            coordinates={path} // Bus route path
            strokeWidth={3}
            strokeColor="blue"
          />

          {/* Dynamic bus marker */}
          {trackerData?.location && (
            <Marker
              coordinate={trackerData.location}
              title={`BUS ${trackerData.vehicle_id || "Unknown"}`}
              description={`Speed: ${trackerData.location.speed || 0} km/h`}
              icon={busIcon} // Dynamically changing the icon
            />
          )}

          {/* Static Markers with Custom Icons */}
          {locations.map((location) => (
            <Marker
              key={location.id}
              coordinate={location.coordinate}
              title={location.title}
              icon={location.icon} // Custom icon for each location
            />
          ))}

          {/* Simulated Marker */}
            <Marker
            coordinate={markerPosition}
            title="BUS 002"
            description="simulated marker"
            onPress={handleMarkerPress} // Start movement when pressed
            icon={markerIcon} // Custom icon for the marker (changes when moving)
            />

          {/* Polyline for the simulated route */}
          <Polyline
            coordinates={polylineCoordinates} // Simulated route path
            strokeWidth={3}
            strokeColor="blue"
          />
        </MapView>
      ) : (
        // Show a loading state while waiting for the map to render
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text>Loading map...</Text>
        </View>
      )}

      {/* Sidebar */}
      <Sidebar isVisible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
        
      {/* Swipe Refresh */}
      <SwipeToRefresh refreshing={refreshing} onRefresh={onRefresh} />

      {/* Header */}
      <View style={styles.header}>
        {!isHidden && ( // Conditionally render the menu icon and date
          <>
            <TouchableOpacity onPress={() => setSidebarVisible(!sidebarVisible)}>
              <Icon name="menu" size={25} color="black" />
            </TouchableOpacity>
            <Text style={styles.date}>{currentDate}</Text>
            <TouchableOpacity style={styles.histogramIcon} onPress={() => {router.push("/(tabs)/history")}}>
              <Icon name="bar-chart-outline" size={25} color="black" />
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity onPress={toggleVisibility} style={styles.eyeIcon}>
          <Icon name={isHidden ? "eye-outline" : "eye-off-outline"} size={25} color="black" />
        </TouchableOpacity>
      </View>

      {/* Free Space */}
      <View style={styles.freeSpace} />

      {/* Conditionally Render Components */}
      {!isHidden && (
        <>
          {/* Swipeable Bus Status */}
          <View style={styles.busContainer}>
            <BusList
              ref={busListRef}
              selectedBus={selectedBus}
              setSelectedBus={setSelectedBus}
            />
          </View>

          {/* Timer */}
          <View style={styles.timerContainer}>
            <Timer 
              ref={timerRef}
            />
          </View>

          {/* Bottom Buttons */}
          <View style={styles.bottomButtons}>
            <TouchableOpacity
                style={[styles.button, styles.onAlleyButton]}
                onPress={() => {
                  if (selectedBus) {
                    setAlleyModalVisible(true); // Open DispatchModal only if a bus is selected
                  } else {
                    alert("Please select a bus first!");
                  }
                }}
              >
                <Text style={styles.buttonText}>Alley On</Text>
              </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.dispatchButton]}
              onPress={() => {
                if (selectedBus) {
                  setDispatchModalVisible(true); // Open DispatchModal only if a bus is selected
                } else {
                  alert("Please select a bus first!");
                }
              }}
            >
              <Text style={styles.buttonText}>Dispatch</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Buttom Space */}
      <View style={styles.buttomSpace} />

      {/* Alley Modal */}
      <AlleyModal
        isVisible={alleyModalVisible}
        onClose={() => setAlleyModalVisible(false)}
        selectedBus={selectedBus}
        onConfirm={() => {
          handleAlleyConfirm();
          handleRefresh();
        }}
      />

      {/* Dispatch Modal */}
      <DispatchModal
        isVisible={dispatchModalVisible}
        onClose={() => setDispatchModalVisible(false)}
        selectedBus={selectedBus}
        onConfirm={() => {
          handleDispatchConfirm();
          handleRefresh();
        }}
        timerRef={timerRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    position: "relative", 
  },
  date: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    flex: 1, 
  },
  histogramIcon:{
    right: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 10, 
    top: 10,
  },
  freeSpace: {
    flex: 1, 
  },
  map: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  details: {
    position: "absolute",
    padding: 10,
    backgroundColor: "#fff",
    top: 50,
    left: 50
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
  },
  busContainer: {
    minHeight: "12%",
    maxHeight: "24%",
  },
  timerContainer:{
    marginBottom: 10,
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  dispatchButton: {
    backgroundColor: "#32CD32",
  },
  onAlleyButton: {
    backgroundColor: "orange",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  buttomSpace: {
    height: "2%",
  },
});

export default App;